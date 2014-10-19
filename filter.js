var markdownAndHighlight = require('./index.js').markdownAndHighlight;
var fs = require('fs');
function compilerFilter(compiler){
	var createParseContext = compiler.createParseContext;
	
	compiler.createParseContext = function(){
		var context = createParseContext.apply(this,arguments);
		var loadXML = context.loadXML;
		context.loadXML = function(path){
			if(/^[^\s<].*\.md$/.test(path) ){
				this.setCurrentURI(path);
				path = this.config.root .resolve('.'+path.path).path;
				var text = fs.readFileSync(path,'utf-8');
				text = "<html><body>"+markdownAndHighlight(text)+"</body></html>";
				return loadXML.call(this,text)
			}else{
				return loadXML.apply(context,arguments);
			}
		}
		return context;
	}
	return compiler
}
exports.compilerFilter = compilerFilter;