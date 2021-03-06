# 更新日志

## v1.0.0-beta.4

`v1.0.0 Beta 4` `2022-04-17`

本发行版为v1.0.0公测版本，已经具备较为完整可用的功能，但可能存在会导致脚本无法稳定运行的问题。

与`v1.0.0 Beta 3`相比，发生了以下改动：

* 增加了+1400%倍速插件、一键三连插件
* 修复未投稿视频页面崩溃问题

目前已知问题如下：

* 部分情况下，点赞列表加载时会发生错误导致程序异常退出
* 向后端发起不符合规范的请求时，可能会产生未被处理的严重错误
* 后端通信协议中尚未包含错误返回代码，前端无法知道是否发生错误
* 动态、收藏列表过于庞大时，前端需要循环多次向后端发起请求，造成较大的性能开销

## v1.0.0-beta.3

`v1.0.0 Beta 3` `2022-04-16`

本发行版为v1.0.0公测版本，已经具备较为完整可用的功能，但可能存在会导致脚本无法稳定运行的问题。

与`v1.0.0 Beta 2`相比，发生了以下改动：

* 增加了页面加载状态，避免未加载完成时进行操作导致错误
* 完善了插件引擎，增加了插件设置菜单

目前已知问题如下：

* 部分情况下，点赞列表加载时会发生错误导致程序异常退出
* 向后端发起不符合规范的请求时，可能会产生未被处理的严重错误
* 后端通信协议中尚未包含错误返回代码，前端无法知道是否发生错误
* 动态、收藏列表过于庞大时，前端需要循环多次向后端发起请求，造成较大的性能开销

## v1.0.0-beta.2

`v1.0.0 Beta 2` `2022-04-14`

本发行版为v1.0.0公测版本，已经具备较为完整可用的功能，但可能存在会导致脚本无法稳定运行的问题。

与`v1.0.0 Beta 1`相比，发生了以下改动：

* 增加了组件加载引擎。现在新增功能可以不再需要直接修改页面程序了
* 增加了**SHAO Note**组件，登录SHAO ID后，能够使用Markdown记录笔记，并自动发布到SHAO Pastebin上

目前已知问题如下：

* 部分情况下，点赞列表加载时会发生错误导致程序异常退出
* 向后端发起不符合规范的请求时，可能会产生未被处理的严重错误
* 后端通信协议中尚未包含错误返回代码，前端无法知道是否发生错误
* 动态、收藏列表过于庞大时，前端需要循环多次向后端发起请求，造成较大的性能开销

## v1.0.0-beta.1

`v1.0.0 Beta 1` `2022-04-12`

本发行版为v1.0.0公测版本，已经具备较为完整可用的功能，但可能存在会导致脚本无法稳定运行的问题。

目前已知问题如下：

* 部分情况下，点赞列表加载时会发生错误导致程序异常退出
* 向后端发起不符合规范的请求时，可能会产生未被处理的严重错误
* 后端通信协议中尚未包含错误返回代码，前端无法知道是否发生错误
* 动态、收藏列表过于庞大时，前端需要循环多次向后端发起请求，造成较大的性能开销