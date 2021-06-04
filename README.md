# lerna-demo

Lerna 是一个工具，它优化了使用 git 和 npm 管理多包存储库的工作流。

本文通过一个示例讲述了如何基于 Lerna 管理多个 package，并和其它工具整合，打造高效、完美的工作流，最终形成一个最佳实践。

## 工作的两种模式

### Fixed/Locked mode (default)

vue,babel 都是用这种，在 publish 的时候,会在 lerna.json 文件里面"version": "0.1.5",,依据这个号，进行增加，只选择一次，其他有改动的包自动更新版本号。

### Independent mode

lerna init --independent 初始化项目。
lerna.json 文件里面"version": "independent",

每次 publish 时，您都将得到一个提示符，提示每个已更改的包，以指定是补丁、次要更改、主要更改还是自定义更改。

TODO 缺图片

## 项目构建

### init

```bash
$ mkdir lerna-demo && cd $_
$ npx lerna init
```

生成以下文件

```bash
lerna-demo/
  packages/
  package.json
  lerna.json
```

### 增加 packages

创新一些新的 pkg

```bash
$ cd packages
$ mkdir pkg-a pkg-b pkg-c

$ cd pkg-a
$ npm init --y
$ cd pkg-b
$ npm init --y


或者使用
$ lerna create pkg-d --y

```

项目结构如下

```bash
$ tree
.
├── README.md
├── lerna.json
├── package.json
└── packages
    ├── pkg-a
    │   └── package.json
    ├── pkg-b
    │   └── package.json
    ├── pkg-c
    │   └── package.json
    └── pkg-d
        ├── README.md
        ├── __tests__
        │   └── pkg-d.test.js
        ├── lib
        │   └── pkg-d.js
        └── package.json

7 directories, 10 files
```

### 分别给相应的 package 增加依赖模块

> `yarn`是`lerna`的最佳搭档。

`lerna`默认使用`npm`作为安装依赖包工具，但也可以选择其他工具。把 npm 替换成 yarn 只需在 lerna 的配置文件添加两行代码即可，配置完以后立刻顺畅百倍。

```json
// lerna.json
{
  "packages": ["packages/*"], // 配置package目录
  "version": "independent",
  "npmClient": "yarn",
  "useWorkspaces": true // 使用yarn workspaces
}
```

配置 package.json 使用`yarn workspaces`

```json
{
  "name": "root",
  "private": true, // root禁止发布
  "devDependencies": {
    "lerna": "^4.0.0"
  },
  "workspaces": [
    // 配置package目录
    "packages/*"
  ]
}
```

**`lerna add <package>[@version] [--dev] [--exact]`**

增加本地或者远程 package 做为当前项目 packages 里面的依赖

- `--dev` devDependencies 替代 dependencies
- `--exact` 安装准确版本，就是安装的包版本前面不带^, `Eg: "^2.20.0" ➜ "2.20.0"`

```bash
$ lerna add chalk #为所有 package 增加 chalk 模块
$ lerna add semver --scope pkg-a        # 为 pkg-a  增加 semver 模块
$ lerna add pkg-a  --scope pkg-b  # 增加内部模块之间的依赖
```

or

```bash
$ yarn workspaces run add chalk # 为所有 package 增加 chalk 模块
$ yarn workspace pkg-a add semver # 为 pkg-a  增加 semver 模块
$ yarn workspace pkg-b add pkg-a@1.0.0 # 这里必须加上版本号，否则报错,将pkg-a作为pkg-b的依赖
```

更多请查看[`lerna add`](https://github.com/lerna/lerna/tree/main/commands/add#readme)

## 发布

```bash
$ lerna publish
```

### 不支持只发布某个 package

lerna 官方不支持仅发布某个 package，见 https://github.com/lerna/lerna/issues/1691，如果需要，只能自己手动的进入package进行发布，这样lerna自带的各种功能就需要手动完成且可能和lerna的功能相互冲突

由于 lerna 会自动的监测 git 提交记录里是否包含指定 package 的文件修改记录，来确定版本更新，这要求设置好合理的 ignore 规则（否则会造成频繁的，无意义的某个版本更新），好处是其可以自动的帮助 package 之间更新版本

例如如果`pkg-b` 依赖了 `pkg-a`，如果 `pkg-a` 发生了版本变动，会自动的将 `pkg-b` 的对 `pkg-a` 版本依赖更新为 `pkg-a` 的最新版本。 如果 `pkg-b` 发生了版本变动，对 `pkg-a` 并不会造成影响。

### 自动选择版本

使用`--conventional-commits` 参数会自动的根据`conventional commit`规范和`git commit message`记录帮忙确定更新的版本号。

```bash
$ lerna version --conventional-commits
```

## 参考链接

- [lerna](https://github.com/lerna/lerna#readme)
- [基于 Lerna 管理 packages 的 Monorepo 项目最佳实践](https://segmentfault.com/a/1190000020047120)
- [基于 lerna 和 yarn workspace 的 monorepo 工作流](https://zhuanlan.zhihu.com/p/71385053)
- [Lerna 中文教程详解](https://segmentfault.com/a/1190000019350611)
- [大前端项目代码重用，也许 lerna 是最好的选择](https://segmentfault.com/a/1190000023160081)
