var fs = require('fs');
var parser = require('../lib');
var assert = require('assert');

var file = __dirname + '/fixtures/coerce.xml';

var data = fs.readFileSync(file);

// With coercion
var result = parser.toJson(data, {reversible: true, coerce: true, object: true});
console.log(result.itemRecord.value);
assert.strictEqual(result.itemRecord.value[0].longValue['$t'], 12345);
assert.strictEqual(result.itemRecord.value[1].stringValue.number, false);
assert.strictEqual(result.itemRecord.value[2].moneyValue.number, true);
assert.strictEqual(result.itemRecord.value[2].moneyValue['$t'], 104.95);
assert.strictEqual(result.itemRecord.value[2].moneyValue.text, 123.45);
assert.strictEqual(result.itemRecord.value[8].text['$t'], 42.42);


// Without coercion
result = parser.toJson(data, {reversible: true, coerce: false, object: true});
assert.strictEqual(result.itemRecord.value[0].longValue['$t'], '12345');
assert.strictEqual(result.itemRecord.value[1].stringValue.number, 'false');
assert.strictEqual(result.itemRecord.value[2].moneyValue.number, 'true');
assert.strictEqual(result.itemRecord.value[2].moneyValue['$t'], '104.95');
assert.strictEqual(result.itemRecord.value[2].moneyValue.text, '123.45');
assert.strictEqual(result.itemRecord.value[8].text['$t'], '42.42');

// With coercion as an optional object
var result = parser.toJson(data, {reversible: true, coerce: {text:String}, object: true});
assert.strictEqual(result.itemRecord.value[0].longValue['$t'], 12345);
assert.strictEqual(result.itemRecord.value[1].stringValue.number, false);
assert.strictEqual(result.itemRecord.value[2].moneyValue.number, true);
assert.strictEqual(result.itemRecord.value[2].moneyValue['$t'], 104.95);
assert.strictEqual(result.itemRecord.value[2].moneyValue.text, '123.45');
assert.strictEqual(result.itemRecord.value[8].text['$t'], '42.42');
