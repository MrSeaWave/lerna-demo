# lerna-demo

针对[lerna-demo](https://mrseawave.github.io/blogs/articles/lerna)创建出来的例子文件

## 编译、压缩、调试

采用 Monorepo 结构的项目，各个 package 的结构最好保持统一。

根据目前的项目状况，设计如下：

- 各 package 入口统一为 index.js
- 各 package 源码入口统一为 src/index.js
- 各 package 编译入口统一为 dist/index.js
- 各 package 统一使用 ES6 语法、使用 Babel 编译、压缩并输出到 dist
- 各 package 发布时只发布 dist 目录，不发布 src 目录

> 因为 dist 是 Babel 编译后的目录，我们在搜索时不希望搜索它的内容，所以在工程的设置中把 dist 目录排除在搜索的范围之外。
