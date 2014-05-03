var LiteEngine = require('lite').LiteEngine;
var path = require('path');
var fs = require('fs');
var http = require('http');
function start(root){
	root = path.resolve(root || './');
	var engine = new LiteEngine(root);
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
		
		if(/\.xhtml$/.test(url)){
			var jsonpath = path.join(root,url.replace(/\.xhtml$/,'.json'));
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
		
	},root).listen(process.env.APP_PORT || 18080);
	console.log('lite test server is started: http://127.0.0.1:'+(process.env.APP_PORT || 18080));
}
exports.start = start;
