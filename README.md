[![Build Status](https://travis-ci.org/jean343/less-vars-to-json.svg?branch=master)](https://travis-ci.org/jean343/less-vars-to-json)
[![npm](https://img.shields.io/npm/v/less-vars-to-json.svg?style=flat-square)](https://www.npmjs.com/package/less-vars-to-json)
# less-vars-to-json
Read [LESS](http://lesscss.org/) variables from the contents of a less file and return them as a javascript object.
```bash
$ yarn add less-vars-to-json
```

### Why?
One can point to a `.less` file from javascript and read the variables. It is useful to declare the variable only once to reduce code duplication. One usecase is to re-use the less variables in runtime theming.

This package has been inspired from [less-vars-to-js](https://github.com/michaeltaranto/less-vars-to-js), and a few modifications were made.
- The variables will be resolved from other values in the same file, or from a supplied object.
- The commented values be ignored.
- The resulting object will not contain the `@` character.

### Example

Example :
```less
// Colour palette
@blue: #0d3880;
@pink: #e60278;

// Elements
@background: @gray;
@favourite: @blue;

// Grid
@row-height: 9;

.element {
    @foreground: black;
    color: @foreground;
}
```
Example output:
```json
{
    "background": "#eee",
    "blue": "#0d3880",
    "favourite": "#0d3880",
    "foreground": "black",
    "pink": "#e60278",
    "row-height": "9"
}
```

### Usage
```javascript
import fs from 'fs';
import lessToJson from 'less-vars-to-json';

// Read the less file in as string
const paletteLess = fs.readFileSync('palette.less', 'utf8');

// Pass in file contents
const palette = lessToJson(paletteLess, { gray: "#eee" });
console.log(palette);
```

### License

[MIT](https://github.com/jean343/less-vars-to-json/blob/master/LICENSE)