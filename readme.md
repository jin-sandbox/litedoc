### 安装litedoc

	npm install litedoc

### 查看文档：

	var litedocDir = require.resolve('litedoc').replace(/[\w\.]+$/,'');
	require('litedoc').start(litedocDir);
	
### 使用litedoc

	//在当前目录下启动一个litedoc 服务
	require('litedoc').start();