/*
* @Author: litongqian
* @Date:   2017-03-8 16:24:25
* @Last Modified by:   litongqian
* @Last Modified time: 2017-03-8 16:24:25
*/
## mobile-app

基于 React.js 的移动端 Web UI 组件库。


1. 使用 组件：

    ``` javascript
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          said: false,
        };

        this.handleClick = this.handleClick.bind(this);
      }

      handleClick() {
        this.setState({
          said: true,
        });
      }

      renderHello() {
        return this.state.said ? (
          <p>Hello World!</p>
        ) : null;
      }

      render() {
        const said = this.state.said;
        const text = said ? 'Said :(' : 'Say hello :)';

        return (
          <div>
            <Button
              amStyle="primary"
              disabled={said}
              onClick={this.handleClick}
            >
              {text}
            </Button>
            {this.renderHello()}
          </div>
        );
      }
    }

    ReactDOM.render(<App />, document.getElementById('root'));


### 文档及演示

1. 在源码目录下执行：

   npm install
   ```

2. 启动开发服务：
    npm run dll //将公共文件react，react-router...提取为一个公用文件在项目中之间引用

    npm start //开启本地服务
   ```

> 上面的命令会开启一个本地调试服务器（[http://localhost:8888/]）。此时，项目`src`目录下的任何文件的变化，都会触发实时构建，并把变更同步到浏览器。
   相关文件构建完成后会自动打开浏览器，可查看文档及组件演示。

### 构建

- 本地打包压缩

npm run build
打包后的文件位于 `dist` 目录下。


## 目录结构

```
.
├── favicon.ico  ---------------------- 页面图标
├── gulpfile.js  ---------------------- gulp入口文件
├── html  ----------------------------- html目录
│   └── index.html  ------------------- 入口页面
├── package.json  --------------------- 项目配置
├── README.md  ------------------------ 说明文件
└── src  ------------------------------ 源码目录
    ├── app  -------------------------- 项目级代码
    │   ├── app.js  ------------------- 项目级脚本逻辑
    │   ├── app.less  ----------------- 全局样式
    ├── components  ------------------- 业务模块集合目录
    ├── i18n  ------------------------- 国际化文案资源文件
    │   ├── en.js
    │   ├── index.js  ----------------- 国际化资源加载器
    │   └── zh-cn.js
    ├── images  ----------------------- 图片资源目录
    └── pages  ------------------------ 页面集合目录
        ├── demo  --------------------- 某一个页面
        │   ├── index.js  ------------- 页面入口文件
        │   ├── PageDemo.js  ---------- 页面视图逻辑
        │   └── PageDemo.less  -------- 页面样式
        └── home  --------------------- 另一个页面
            ├── index.js
            ├── PageHome.js
            └── PageHome.less




## 外部工具

脚手架默认引入了以下外部工具库：

| 类库 | 全局名称 |
| ---- | ------ |
| React | React |
| Redux | Redux |
| ReactDOM | ReactDOM |



> [React](http://reactjs.cn/) 和 [Redux](https://github.com/reactjs/redux) 的使用，请参考各自的官方文档。


## 国际化解决方案

`src/i18n` 目录为国际化文案资源文件存放目录，其中除了 `index.js` 之外的文件均为国际化语言资源文件。

`index.html` 中通过 `locale` 变量指定当前使用语言。

可以在启动本地调试服务器时，通过 `--locale <locale>` 参数指定当前调试环境使用的语言。

js文件中可使用如下方法来注入国际化文案：

```js
let i18n = require('i18n');
...
i18n("key"[, argv1[, argv2...]])
```

首先会找到对应的语言资源文件，然后通过 key 对应到文案模板。

如果文案中有 `{0}{1}` 变量，将使用 argvX 参数进行替换，更详细的使用说明请参考[这里](https://www.npmjs.com/package/i18n-helper)。

- 国际化资源文件索引命名规范：
  - 全局公用资源：global.xxx
  - 模块所属资源：moduleName.xxx
  - 页面所属资源：pageName.xxx

## 项目中使用图标（或图片）

### 使用图标（svg）

我们推荐使用 svg 作为图标解决方案。

require svg 文件路径将直接返回包含这个 svg 的 react component。

```js
let Star = require('./star.svg');
...
render() {
    return (
        <Star className="star"/>
    );
}
```

### 使用图片（png、jpg、jpeg、gif）

在 js 中 require（或在 css 中 url）一个相对路径的图片资源，将返回这个图片内容的 data-uri。

```js
let img = require('./img.png');
...
render() {
    return (
        <img src={img} alt=""/>
    );
}
```

```css
.abc {
    background-image: url(./img.png);
}
```

## 数据层和模拟数据解决方案

- 请参考 [NattyFetch 官方文档](https://github.com/Jias/natty-fetch)。

## 其他

- 建议使用[es6](http://es6.ruanyifeng.com/)进行编码。



采用了browser-sync这个包，它可以使你在电脑上开发的同时，页面
效果也能同步在你的手机上展示（比如本人公司电脑连的网线，手机连的wifi，在这种情况下我的手机就可以链接电脑上的开发页面） 下面以本模板为例，简要展示一下步骤

确保本模板的包安装完毕后(npm install), 运行 npm start, 大概十秒后，编译完成，浏览器自动打开进入开发页面 http://localhost:8888/
然后打开 http://localhost:8889/ ，这个页面正是browser-sync提供的，你会看到大概这样
上方指的是你的开发页面在PC端的地址，下方指的是你的开发页面在用了wifi设备上的浏览地址。
它的意义显而易见，你可以随时看到你的页面在手机端会是什么样子，极大方便调试！


FastClick  删除了这段代码,
if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

    // AMD. Register as an anonymous module.
    define(function() {
      return FastClick;
    });
  }
