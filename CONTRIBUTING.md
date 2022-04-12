# 代码贡献指南

## 后端搭建

本项目后端分为API后端和静态资源后端

### API后端

* 需要后端安装有Web服务器、PHP和兼容MySQL的数据库
    * 建议环境为：Nginx 1.19、MySQL 5.7、PHP 7.4

1. 将代码下载或克隆到本地
2. 视情况选择分支，`master`分支为正式版，或根据标签选择对应的提交
3. 将`/backend/db_template.sql`导入数据库，并将`/backend/`下所有文件上传到Web服务器
4. 在`config.php`内填写数据库信息
5. 修改服务器配置，使之自动添加HTTP头`Access-Control-Allow-Origin: *`
    * 在Nginx下，需要在配置中添加行`add_header 'Access-Control-Allow-Origin' '*';`

**注意事项**

### 静态资源后端

* 由于需要后端允许CORS访问，所以可能无法使用Github Pages、Gitee Pages等部分静态资源托管服务。建议自行搭建后端或使用Vercel、Netlify等服务。

1. 将代码下载或克隆到本地
2. 视情况选择分支，`master`分支为正式版，或根据标签选择对应的提交
3. 将`/static/`下所有文件上传到服务器

## 前端开发

* 需要浏览器安装有Tampermonkey，同时需要能提供CORS服务的Web服务器
    * Violentmonkey可能可用，但未进行测试
    * 建议环境为：Visual Studio Code、Firefox Developer Edition 100.0、Tampermonkey 4.16

1. 将代码下载或克隆到本地
2. 视情况选择分支，`master`分支为正式版，或根据标签选择对应的提交
3. 参考[后端搭建](#后端搭建)搭建后端
4. 修改`/TsinghuaCloudRemake.user.js`中的`staticURL`（静态资源后端）和`backendURL`（API后端）部分
5. 在浏览器中打开`/TsinghuaCloudRemake.user.js`并刷新，在弹出的Tampermonkey界面中安装

## 项目架构

为了提高开发效率，增强本项目的拓展性，本项目采用用户脚本、静态后端、API后端三者分离的架构。

### 工作流程

用户访问清华大学云盘时，Tampermonkey调用用户脚本。用户脚本会根据当前页面的信息判断是否需要进入Remake模式，目前而言，仅有在视频的分享页面中会进入Remake模式。

进入Remake模式后，用户脚本将会从配置的静态后端获取静态资源，并根据其对当前页面进行修改，最后激活静态资源中的JavaScript代码并退出执行。

静态资源中的JavaScript代码将会初始化各种交互界面，并从后端获取必要信息，修改当前页面。

### 用户脚本

即`/TsinghuaCloudRemake.user.js`，包含最基本的配置设定、页面类型匹配和资源加载功能，但不包含任何对于具体页面生效的逻辑的实现。

这种形式在极大地减小用户脚本体积的同时，允许后端进行热更新，从而避免用户需要频繁更新脚本的问题。

此外，在用户脚本中预留了对于除了视频以外的文件类型的匹配。这意味着如果将来需要改进其它文件类型的页面，只需要简单地添加少量判断代码，并另外写后端即可。

为了保证用户数据安全，用户脚本内不使用UnsafeWindow，而是将配置信息作为一个`<meta>`元素传入。

### 静态后端

静态后端中包含用于修改页面的代码以及用于执行逻辑的JavaScript代码。

由于静态后端不属于用户脚本，因此JavaScript代码将会以原生模式运行。

### API后端

API后端由PHP开发，包含数据库操作和数据处理。

API后端的开发原则是尽可能少进行计算，从而减小服务器压力。进一步说，API后端尽可能被定为前端与数据库互通的接口。