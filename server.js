var LiteEngine = require('lite').LiteEngine;
var path = require('path');
var fs = require('fs');
var http = require('http');
try{
	var renderPPT = require('./ppt').renderPPT;
}catch(e){
	console.log("load node ppt failed:"+e)
}
function start(root){
	//console.log('@@@'+new Error().stack)
	root = path.resolve(root || './');
	var engine = new LiteEngine(root,{filter:require.resolve('./filter')+'#compilerFilter'});
	var port = process.env.APP_PORT || 18080;
	require('lite/test/file-server').createServer(function (req, response,root) {
		var url = req.url;
		var param = {};
		var p = url.indexOf('?');
		if(p>0){
			var query = url.substring(p+1);
			query.replace(/(\w+)=([^&]+)/g,function(a,k,v){
				param[decodeURIComponent(k)] = decodeURIComponent(v);
			})
			url = url.substring(0,p);
		}
		
		if(/test\.md$|\.xhtml$/.test(url)){
			var jsonpath = path.join(root,url.replace(/\.\w+$/,'.json'));
	    	fs.stat(jsonpath,function(error,stats){
	    		if(stats && stats.isFile()){
					var json = fs.readFileSync(jsonpath,'utf8');
					var model = new Function('return '+json)();
	    			engine.render(url,model,req,response);
	    		}else{
	    			engine.render(url,{},req,response);
	    		}
	    	})
	    	return true;
		}
		if(renderPPT && renderPPT(req,response,root)){
			return true;
		}
		
	},root).listen(port);
	console.log('lite test server is started: http://localhost:'+(port));
}
exports.start = start;
