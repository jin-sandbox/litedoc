var fs = require('fs');
var path = require('path');
try{
	/*/先尝试使用官方提供的版本
	var nodepptDir = path.join(require.resolve('nodeppt/bin/nodeppt'),'../../') ;
	var md_parser = require('nodeppt/lib/md_parser');
	var mimes = require('nodeppt/lib/mime.json');
	//*/
	throw "";
}catch(e){
	var nodepptDir = path.join(__dirname,'nodeppt');
	var mimes = require('./nodeppt/lib/mime.json');
	var md_parser = require('./nodeppt/lib/md_parser');
	var mimes = require('./nodeppt/lib/mime.json');
}
//console.log(nodepptDir)
		
exports.renderPPT = function(req,res,root){
	var url = req.url.replace(/[?#].*/,'');
	var realPath = path.join(root,url);
	try {
	    if (fs.existsSync(realPath)) {
			var stats = fs.statSync(realPath);
	    	if(stats.isDirectory()){
	    		return false;
	    	}
	    	if(/\.md$/.test(url)){
				markdown(realPath, url, res) ;
				return true;
			}else{
				assets(realPath, url, res)
				return true;
			}
	    } else {
	    	realPath = path.join(nodepptDir,'assets'+url);
	    	//console.log(realPath + fs.existsSync(realPath))
	    	if (fs.existsSync(realPath)) {
	    		assets(realPath, url, res)
	    	}else{
	        	page404(res, url);
	    	}
	    	return true;
	    }
    } catch (e) {
        res.writeHead(500, {
            'Powered-By': 'nodePPT',
            'Content-Type': 'text/plain'
        });
        console.log(e.toString());
        res.end(e.toString());
        return true;
    }
}


function markdown(realPath, url, res) {
    var content = fs.readFileSync(realPath, 'utf-8').toString();
	var argvObj = {};
	var queryObj = {};
    var html = md_parser(content, function() {}, argvObj, queryObj);
    res.writeHead(200, {
        'Powered-By': 'nodePPT',
        'Content-Type': 'text/html'
    });
    res.write(html);
    res.end();
}


function assets(realPath, url, res) {
    //静态资源
    var ext = realPath.replace(/.*\.(\w+)$/,'$1');
    if(ext == realPath){ext = "txt"}
    fs.readFile(realPath, 'binary', function(err, file) {
        if (err) {
            res.writeHead(500, {
                'Powered-By': 'nodePPT',
                'Content-Type': 'text/plain'
            });
            res.end(err);
        } else {
            res.writeHead(200, {
                'Powered-By': 'nodePPT',
                'Content-Type': mimes[ext]
            });
            res.write(file, 'binary');
            res.end();
        }
    });
}

function page404(res, url) {
	console.log('404 file:'+url)
    res.writeHead(404, {
        'Powered-By': 'nodePPT',
        'Content-Type': 'text/plain'
    });

    res.write('This request URL ' + url + ' was not found on this server.');
    res.end();
}
