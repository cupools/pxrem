## pxrem

Transforming css from px to rem.

## Todo

- [x] Basic function
- [x] Basic CLI
- [x] Filter by comment mark
- [x] Test coverage
- [ ] Documentation

## Getting Started

```js
var pxrem = require('pxrem')
var option = {
  root: 75,
  filter: /^border/
}

var output = pxrem('.foo { width: 75px; border: 1px solid #000; }', option)
//=> '.foo { width: 1rem; border: 1px solid #000; }'
```

```bash
$ pxrem -h

  Usage: pxrem [options]

  Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -f, --filename <filepath>  filename of .css to be used
    -o, --output <filepath>    output path
    -r, --root [value]         root value from px to rem, default to 75
        --fixed [value]        precision of rem value, default to 6
        --filter [RegExp]      regexp for declaration which should be ignored
        --keepPx               keep px for compatible in old browsers
```

## Test

```bash
$ npm i && npm test
```
