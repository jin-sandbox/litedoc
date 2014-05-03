var LiteEngine = require('lite').LiteEngine;
var path = require('path');
var fs = require('fs');
var http = require('http');
var engine;
function start(root){
	if(engine != null){//node 一个重复执行的奇怪问题
		return ;
	}
	//console.log('@@@'+new Error().stack)
	root = path.resolve(root || './');
	engine = new LiteEngine(root);
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
		
	},root).listen(port);
	console.log('lite test server is started: http://localhost:'+(port));
}
exports.start = start;
