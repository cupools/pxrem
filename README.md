## pxrem

[![Build Status](https://travis-ci.org/cupools/pxrem.svg?branch=master)](https://travis-ci.org/cupools/pxrem)
[![Coverage Status](https://coveralls.io/repos/github/cupools/pxrem/badge.svg?branch=master)](https://coveralls.io/github/cupools/pxrem?branch=master)

PostCSS plugin that transforming css from px to rem.

It's also avaliable as:

- [pxrem-loader](https://github.com/cupools/pxrem-loader)
- [fis3-postprocessor-pxrem](https://github.com/cupools/fis3-postprocessor-pxrem)

## Getting Started

```bash
$ npm i --save-dev cupools/pxrem
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

## Options

- root: root value from px to rem, default to 75
- fixed: precision of rem value, default to 6
- filter: css declaration that should be ignored, can be regexp or function, default to null
- keepPx: keep px for compatible in old browsers, default to false
- commentFilter: the comment that after css declaration which should be ignored, default to 'no'
- enable: enable the plugin, default to true

## Examples

### Ignore border's width as `1px`

```js
var pxrem = require('pxrem')
var content = require('fs').readFileSync('style.css')
var option = {
  root: 75,
  fixed: 6,
  filter: function(prop, value, decl) {
    if (prop === 'border' && value.indexOf('1px') === 0) {
      return true
    }
    return false
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

### For old browsers which not support rem

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
