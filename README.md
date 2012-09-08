# Simple SAX-based XML2JSON Parser.

It does not parse the following elements: 

* CDATA sections
* Processing instructions
* XML declarations
* Entity declarations
* Comments

## Installation
```
$ npm install xml2json
```

## Usage 
```
var parser = require('xml2json');

var xml = "<foo>bar</foo>";
var json = parser.toJson(xml); //returns a string containing the JSON structure by default
console.log(json);
```
### Options

* **object:** Returns a Javascript object instead of a JSON string
* **reversible:** Makes the JSON reversible to XML (*)
* **coerce:** Makes type coercion
* **sanitize:** Sanitizes the following characters:

| Character | Escaped |
| --------- | ------- |
|    `<`    |  `&lt;` |
|    `>`    |  `&gt;` |
|    `(`    |  `&#40;`|
|           |         |
|           |         |

* **trim:**

```
options = {
        object: false,
        reversible: false,
        coerce: true,
        sanitize: true,
        trim: true };
```
* if you want to get the Javascript object then you might want to invoke parser.toJson(xml, {object: true});
* if you want a reversible json to xml then you should use parser.toJson(xml, {reversible: true});
* if you want to keep xml space text then you should use `options.space`, `parser.toJson(xml, {space: true})`;

## License
(The MIT License)

Copyright 2012 BugLabs. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.