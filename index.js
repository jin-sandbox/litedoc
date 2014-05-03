var markdown = require('markdown').markdown;
var hljs = require('highlight.js');

function markdownAndHighlight(text){
	var html = markdown.toHTML( text);
	return html.replace(/(<code(?:\s+\w+[^>]*)*?>)([\s\S]*?)(<\/code>)/g,function(a,prefix,content,postfix){
		content = content.replace(/&(lt|gt|amp|quot|#\d+);/g,function(a,c){
			if(c == 'lt')return '<';
			if(c == 'gt')return '>';
			if(c == 'amp')return '&';
			if(c=='quot')return '"';
			return String.fromCharCode(c.substring(1))
			
		}).replace(/<\!\[CDATA\[([\s\S]*?)\]\s*\]>/g,'<![CDATA[$1]]>')
		//return prefix + hljs.highlight('java',content).value+postfix;
		return prefix + hljs.highlightAuto(content).value+postfix;
		//return prefix + hljs.highlightAuto(content,['java','javascript','xml']).value+postfix;
	})
}
function seekMarkdown(text){
	var html = markdownAndHighlight( text);
	this.append(html)
	return text.length;
}

function parseCode(node){
	try{
		var text = String(node.textContent || node.text);
	    text = text.replace(/^\s*[\r\n]+|[\r\n]+\s*$/g,'');
	    text = text.split(/\r\n?|\n/);
	    var len = text.length;
	    text = text.join('\n');
	    while(true){
	    	var text2 = text.replace(/^[\t ]/mg,'');
	    	if(text.length - text2.length != len){
	    		break;
	    	}
	    	text = text2;
	    }
		var html = hljs.highlightAuto(text).value;
		this.append("<pre><code>" + html+"</code></pre>");
	}catch(e){
		console.log(e);
		throw e;
	}
}
function parseMarkdown(node){
	try{
		var html = markdownAndHighlight(node.textContent);
		this.append(html);
	}catch(e){
		console.log(e);
		throw e;
	}
}
exports.parseCode = parseCode;
exports.parseMarkdown = parseMarkdown;
exports.seekMarkdown = seekMarkdown;
exports.start = function(root){
	//console.log('## start!')
	require('./server').start(root);
};
