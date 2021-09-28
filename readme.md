# vue-module-federation-cli-next

## 前言

因为公司项目众多，业务庞大，但各项目间拥有诸多重叠功能。所以以节约开发成本，提高代码整洁性和复用率为目的，开始进行本次微服务框架的调研和构建。本次调研仅针对前端，基于前端构建工具 **webpack5**  的新特性：**Module Federation** 开发完成。该技术可以实现项目间的组件共享，甚至是依赖库共享，不仅仅可以提高代码复用率，还大幅度节约了网络资源。故选择该技术作为未来前端项目开发的方式。

附注：本项目基于 **Vue 3.0**，使用 **vue-cli 5.0 beta** 构建，本项目主要为学习和实验性质，如果对您有所帮助，请给颗星星，谢谢啦。

## 开发环境

### 运行环境：

**NodeJS**：前端开发必备环境，[安装地址 ](https://nodejs.org/zh-cn/download/)；

**npm**：（NodeJS自带）npm 包管理器，*NodeJS 环境自带，不需要额外安装*。

### 技术构成：

**vue-cli**：最新版本（*截至文档完成版本：5.0.0-beta.3*），目前只有 5.0 以上版本的脚手架使用了 webpack5，才能支持 Module Federation 功能。

**element-plus**：element-ui 的最新版本，兼容 vue3 内核。

### 使用工具：

**Windows Terminal**：一款非常好用的 command line 工具，支持 wsl sub system，所以你也可以选择用 ubuntu 来作为项目本身的开发环境，[安装文档](https://docs.microsoft.com/zh-cn/windows/terminal/get-started)；

**Visual Studio Code**：前端开发必备 IDE，下列表为必装 Extension，[安装地址](https://code.visualstudio.com/)：

- ESlint：代码格式规范和检查工具，使用 ESLint 可以快速发现自己的代码格式问题，让项目整体符合统一的代码格式标准；
- Vetur：提供语法错误检查，语法高亮，代码自动补全等功能；
- Prettier ESLint：提供代码自动格式化等功能。

## 构建过程

**简介：**构建过程指该项目的构建过程，总结了一些构建整个微服务框架的过程和踩过的坑。开发过程除非需要自己使用脚手架重新搭建，并不需要特别注意，可以直接跳过该部分文档的阅读。有兴趣的朋友可以看一下供开发时的参考。

**注意**：不要使用 **cnpm** 安装依赖库，**webpack 5** 的某些功能兼容 **cnpm** 。

**附注：**代码因为还处于开发中，短期内会有大量变更，所以目前不会逐行注释，未来该文档会随着代码更新持续维护。

------

1.首先将运行环境和使用工具安装好，安装包参见安装环境所给链接即可，Windows Terminal 可以使用 Windows Store 傻瓜化安装；其中 **NodeJS** 和 **npm** 的验证方式如下：

```powershell
PS C:\> node -v
v14.17.5
```

```powershell
PS C:\> npm -v
6.14.14
```

2.安装 **vue-cli**：

```powershell
PS C:\> npm install -g @vue/cli@next
......
......
+ @vue/cli@5.0.0-beta.3
added 886 packages from 532 contributors in 69.062s
```

3.检查 **vue-cli** 版本：

```powershell
PS C:\> vue -V
@vue/cli 5.0.0-beta.3
```

****4**.**构建项目，根目录用于包含所有前端项目，根目录内增加两个案例项目，新建一个目录作为根目录，使用 vue create 进行构建，如下：

```powershell
PS D:\> vue create vue-mother-app
......
......
PS D:\> vue create vue-sub-app
......
......
```

构建时的配置选择：

```powershell
? Please pick a preset:
> StandardVue3Configure ([Vue 3] dart-sass, babel, router, vuex, eslint, unit-jest)
  StandartVue2 ([Vue 2] dart-sass, babel, router, vuex, eslint, unit-jest)
  Default ([Vue 2] babel, eslint)
  Default (Vue 3) ([Vue 3] babel, eslint)
  Manually select features
```

其中上面两个配置是我自己生成的，大家在使用的时候选择同样的选项就可以了。两个项目都构建完成后，如果构建的没有问题，项目的目录结构应该如下图所示：

```
root
  |—vue-mother-app	//用于存放公共组件的项目
  |—vue-sub-app		//实际的项目，用于使用联邦组件
```

**注意**：实际上模块联邦中，各项目都可以暴露自己的组件给其他项目，并没有一个真正的父子等级，我之所以按照这个思路来构建，目前为止是因为将所有公共组件暴露出来比较便于管理，也比较符合公司的需求。未来如果有变动，我会更新此处的文档。***考虑到可能发生的性能问题，可预期的未来此处将会有变化。***

****5**.**在 **vue-mother-app**下建立一个新的案例组件，命名为 **BlueBox**，相对路径如下：

```powershell
root\vue-mother-app\src\components\BlueBox\index.vue
```

代码如下：

```vue
<template>
  <div class="BlueBox">
    {{ welcomeWord }}
  </div>
</template>
<script>
export default {
  name: 'BlueBox',
  props: {
    welcomeWord: {
      type: String,
      default: 'A pink box with default settings'
    }
  }
}
</script>
<style lang="scss" scoped>
.BlueBox {
  width:300px;
  height:200px;
  line-height:200px;
  margin: 0 auto;
  color:#fff;
  background:blue;
  border:1px solid blue;
}
</style>
```

其暴露了一个示范参数 **welcomeWord** 可供使用，本地调用展示为一个蓝色盒子。没有实际作用，仅作为 **remote** 调用的一个范例存在。

5.分别在两个项目的目录下新建 **vue.config.js**，用于自定义 **webpack** 配置。文件内容如下：

<!--./vue-mother-app/vue.conifg.js-->

```javascript
const { ModuleFederationPlugin } = require('webpack').container
const deps = require('./package.json').dependencies

const moduleFederationName = 'motherApp'
const moduleFederationPath = process.env.NODE_ENV === 'production' ? 'http://localhost:3000/vue-mother-app/' : 'http://localhost:3000/'

module.exports = {
  publicPath: moduleFederationPath,
  devServer: {
    port: 3000,
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].excludeChunks = [
          moduleFederationName
        ]
        return args
      })
  },
  configureWebpack: {
    experiments: {
      topLevelAwait: true
    },
    plugins: [
      new ModuleFederationPlugin({
        //此处是项目本身的别名，在其他app调用时会用到
        name: moduleFederationName,
        library: {
          type: 'var',
          name: moduleFederationName
        },
        //此处是对外暴露的js文件名，也是其他app获取公共组件的一个实现。
        filename: process.env.NODE_ENV === 'production' ? 'remoteEntry.[contenthash:8].js' : 'remoteEntry.js',
        //此处是暴露的组件名和组件文件位置，其中组件名需要在调用时被用到。
        exposes: {
          './BlueBox' : './src/components/BlueBox/index.vue'
        },
        //此处分享了本项目用到的依赖库，其他项目在调用本项目时将会比对本项目分享的依赖库，并且将重复的依赖库剔除，以此达到节约网络资源的结果。
        shared: {
          ...deps,
          vue: {
            requiredVersion: deps.vue,
            singleton: true
          }
        }
      })
    ]
  }
}
```

<!--./vue-sub-app/vue.conifg.js-->

```javascript
const { ModuleFederationPlugin } = require('webpack').container 
const deps = require('./package.json').dependencies

const moduleFederationName = 'subApp'
const moduleFederationPath = process.env.NODE_ENV === 'production' ? 'http://localhost:3000/vue-sub-app/' : 'http://localhost:3001/'

module.exports = {
  publicPath: moduleFederationPath,
  devServer: {
    port: 3001
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].excludeChunks = [
          moduleFederationName // don't include remoteEntry.js to index.html
        ]
        return args
      })
  },
  configureWebpack: {
    experiments: {
      topLevelAwait: true
    },
    plugins: [
      new ModuleFederationPlugin({
        name: moduleFederationName,
        //此处是项目获取公共组件的方式
        remotes: {
          motherApp: 'motherApp@http://localhost:3000/remoteEntry.js'
        },
        filename: process.env.NODE_ENV === 'production' ? 'remoteEntry.[contenthash:8].js' : 'remoteEntry.js',
        shared: {
          ...deps
        }
      })
    ]
  }
}
```

6.在 **vue-sub-app** 的 about 页面下进行调用，调用代码如下：

<!--./vue-sub-app/src/views/About.vue-->

```vue
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <blue-box welcome-word="From Sub App Remote Component" />
  </div>
</template>
<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    //此处注意，必须使用defineAsyncComponent对组件进行包裹，不然因为异步操作组件会无法渲染。
    BlueBox: defineAsyncComponent(() => import('motherApp/BlueBox'))	
  }
}
</script>
```

7.最后，使用 **windows terminal** 分别启动两个项目，如果没有异常，访问 http://localhost:3001 进入 **/about** 页面即可看到范例组件 **BlueBox**，并且参数被成功传入，蓝色盒子中应显示：

```
From Sub App Remote Component
```

## 使用说明

**简介：**该项目的 clone 和在本地启动开发环境的过程。

------

1.使用命令行，或一款 git 工具克隆本项目：

```powershell
PS D:\>git clone git@39.105.115.119:module-federation-group/protoTypeLib/vue-module-federation-cli-next.git
```

2.进入母项目，打开 windows terminal，并启动项目：

```powershell
PS D:\demo\vue-mother-app> npm run serve
```

3.新建一个 windows terminal 标签，进入对应子项目目录，并启动项目：

```powershell
PS D:\demo\vue-sub-app> npm run serve
```

4.启动成功，使用 visual studio code 打开**子项目**目录，在**子项目**下进行开发。

## 下一步

目前本框架已完成技术验证，也加入了element-ui，细节配置还有待进行，在接下来的过程中，我会加入一些常用功能诸如style加载器、svg加载器等等，并对文档持续更新。

