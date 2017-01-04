## pxrem

[![Build Status](https://travis-ci.org/cupools/pxrem.svg?branch=master)](https://travis-ci.org/cupools/pxrem)
[![Coverage Status](https://coveralls.io/repos/github/cupools/pxrem/badge.svg?branch=master)](https://coveralls.io/github/cupools/pxrem?branch=master)

PostCSS 插件，用于将 CSS 中的 px 单位转换为 rem

同时可用于:

- [pxrem-loader](https://github.com/cupools/pxrem-loader)
- [fis3-postprocessor-pxrem](https://github.com/cupools/fis3-postprocessor-pxrem)

## 使用

```bash
$ npm i --save-dev pxrem
```

```js
var pxrem = require('pxrem')
var option = {
  root: 75,
  filter: /^border/
}

pxrem.process('.foo { width: 75px; border: 1px solid #000; }', option).toString()
//=> '.foo { width: 1rem; border: 1px solid #000; }'
```

或者配合 [postcss-loader][] 在 Webpack 中使用

```js
// builder/webpack.config.base.js
const pxrem = require('pxrem')

module.exports = {
  module: {},
  postcss: () => {
    return [
      autoprefixer,
      pxrem({
        root: 1000,
        filter: (_, val) => val.slice(0, 3) !== '1px'
      })
    ];
  },
}
```

## 配置

- root: 由 px 转换为 rem 计算用的值, 默认为 75
- fixed: 保留的小数位，默认为 6
- filter: 过滤不需要进行单位转换的 CSS 属性，可以是正则表达式或者函数，默认为 null
- keepPx: 是否保留 px 单位以兼容旧浏览器，默认为 false
- commentFilter: CSS 注释的值，用来声明当前属性不需要进行单位转换，默认为 "no"

## 示例

### 忽略转换 border 及 font-size

由于 1px 转换为 rem 后在 Android 浏览器中显示会有异常，不推荐转换 1px 为 0.001rem。

```js
var pxrem = require('pxrem')
var content = require('fs').readFileSync('style.css')
var option = {
  root: 75,
  fixed: 6,
  filter: function(prop, value, decl) {
    return prop === 'border' && value.indexOf('1px') === 0
  }
}

var result = pxrem.process(content, option)
console.log(result.toString())
```

```css
/* source */
.foo {
  width: 75px;
  height: 10px;
  font-size: 24px; /*no*/
  background: url('icon.png') no-repeat;
  background-size: 15px 15px;
  border: 1px solid #000;
}

/* output */
.foo {
  width: 1rem;
  height: 0.133333rem;
  font-size: 24px;
  background: url('icon.png') no-repeat;
  background-size: 0.2rem 0.2rem;
  border: 1px solid #000;
}
```

### 兼容旧浏览器

```js
var pxrem = require('pxrem')
var content = require('fs').readFileSync('style.css')
var option = { keepPx: true }

var result = pxrem.process(content, option)
console.log(result.toString())
```

```css
/* source */
.foo {
  width: 75px;
  height: 10px;
  font-size: 24px; /*no*/
  background: url('icon.png') no-repeat;
  background-size: 15px 15px;
}

/* output */
.foo {
  width: 75px;
  width: 1rem;
  height: 10px;
  height: 0.133333rem;
  font-size: 24px;
  background: url('icon.png') no-repeat;
  background-size: 15px 15px;
  background-size: 0.2rem 0.2rem;
}
```

## Test

```bash
$ npm i && npm test
```

## License

Copyright (c) 2016 cupools

Licensed under the MIT license.

[postcss-loader]: https://github.com/postcss/postcss-loader