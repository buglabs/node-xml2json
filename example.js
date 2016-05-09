var parser = require('./index');

// xml to json
var xml = "<foo attr=\"value\">bar</foo>";
console.log("input -> %s", xml)
var json = parser.toJson(xml);
console.log("to json -> %s", json);

var xml = parser.toXml(json);
console.log("back to xml -> %s", xml)
