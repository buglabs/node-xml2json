var fs = require('fs');
var parser = require('../lib');
var assert = require('assert');

var xml = fs.readFileSync('./fixtures/array-notation.xml');
var expectedJson = JSON.parse( fs.readFileSync('./fixtures/array-notation.json') );

var json = parser.toJson(xml, {object: true, arrayNotation: true});

assert.deepEqual(json, expectedJson);

console.log('xml2json options.arrayNotation passed!');
