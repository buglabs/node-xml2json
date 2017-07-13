var fs = require('fs');
var path = require('path');
var parser = require(__dirname + '/../lib');
var assert = require('assert');

var Code = require('code');
var Lab = require('lab');


// Test shortcuts

var lab = exports.lab = Lab.script();
var expect = Code.expect;
var describe = lab.describe;
var it = lab.test;

var internals = {};


describe('xml2json', function () {

    it('converts with array-notation', function (done) {

        var xml = internals.readFixture('array-notation.xml');
        var result = parser.toJson(xml, { arrayNotation: true });
        var json = internals.readFixture('array-notation.json');

        expect(result).to.equal(json);

        done();
    });

    it('coerces', function (done) {

        var xml = internals.readFixture('coerce.xml');
        var result = parser.toJson(xml, { coerce: false });
        var json = internals.readFixture('coerce.json');

        expect(result + '\n').to.equal(json);

        done();
    });

    it('handles domain', function (done) {

        var xml = internals.readFixture('domain.xml');
        var result = parser.toJson(xml, { coerce: false });
        var json = internals.readFixture('domain.json');

        expect(result + '\n').to.equal(json);

        done();
    });

    it('does large file', function (done) {

        var xml = internals.readFixture('large.xml');
        var result = parser.toJson(xml, { coerce: false, trim: true, sanitize: false });
        var json = internals.readFixture('large.json');

        expect(result + '\n').to.equal(json);

        done();
    });

    it('handles reorder', function (done) {

        var xml = internals.readFixture('reorder.xml');
        var result = parser.toJson(xml, {});
        var json = internals.readFixture('reorder.json');

        expect(result).to.equal(json);

        done();
    });

    it('handles text with space', function (done) {

        var xml = internals.readFixture('spacetext.xml');
        var result = parser.toJson(xml, { coerce: false, trim: false });
        var json = internals.readFixture('spacetext.json');

        expect(result).to.equal(json);

        done();
    });

    it('does xmlsanitize', function (done) {

        var xml = internals.readFixture('xmlsanitize.xml');
        var result = parser.toJson(xml, {sanitize: true});
        var json = internals.readFixture('xmlsanitize.json');

        expect(result).to.equal(json);

        done();
    });

    it('does xmlsanitize of text', function (done) {

        var xml = internals.readFixture('xmlsanitize2.xml');
        var result = parser.toJson(xml, {sanitize: true, reversible: true});
        var json = internals.readFixture('xmlsanitize2.json');

        expect(result).to.equal(json);

        done();
    });

    it('does json unsanitize', function (done) {

        var json = internals.readFixture('xmlsanitize.json');
        var result = parser.toXml(json, {sanitize: true});
        var xml = internals.readFixture('xmlsanitize.xml');

        expect(result).to.equal(xml);

        done();
    });

    it('does json unsanitize of text', function (done) {

        var json = internals.readFixture('xmlsanitize2.json');
        var result = parser.toXml(json, {sanitize: true});
        var xml = internals.readFixture('xmlsanitize2.xml');

        expect(result).to.equal(xml);

        done();
    });

    it('does doesnt double sanitize', function (done) {

        var json = internals.readFixture('xmlsanitize3.json');
        var result = parser.toXml(json, {sanitize: true});
        var xml = internals.readFixture('xmlsanitize3.xml');

        expect(result).to.equal(xml);

        done();
    });

    it('does doesnt double unsanitize', function (done) {

        var xml = internals.readFixture('xmlsanitize3.xml');
        var result = parser.toJson(xml, {sanitize: true, reversible: true});
        var json = internals.readFixture('xmlsanitize3.json');

        expect(result).to.equal(json);
        done();
    });

    it('converts with forceArrays', function(done) {
        var xml = internals.readFixture('forceArray.xml');
        var result = parser.toJson(xml, {arrayNotation: ['drivers', 'vehicles']});
        var json = internals.readFixture('forceArray.json');

        expect(result).to.equal(json);
        done();
    });

    it('throws error on bad options', function (done) {

        var throws = function() {

            var result = parser.toJson(xml, { derp: true});
        };

        expect(throws).to.throw();
        done();
    });

    describe('coercion', function () {

        var file = __dirname + '/fixtures/coerce.xml';
        var data = fs.readFileSync(file);

        it('works with coercion', function(done) {

            // With coercion
            var result = parser.toJson(data, {reversible: true, coerce: true, object: true});
            expect(result.itemRecord.value[0].longValue['$t']).to.equal(12345);
            expect(result.itemRecord.value[1].stringValue.number).to.equal(false);
            expect(result.itemRecord.value[2].moneyValue.number).to.equal(true);
            expect(result.itemRecord.value[2].moneyValue['$t']).to.equal(104.95);
            expect(result.itemRecord.value[2].moneyValue.text).to.equal(123.45);
            expect(result.itemRecord.value[8].text['$t']).to.equal(42.42);
            done();
        });

        it('works without coercion', function(done) {

            var result = parser.toJson(data, {reversible: true, coerce: false, object: true});
            expect(result.itemRecord.value[0].longValue['$t']).to.equal('12345');
            expect(result.itemRecord.value[1].stringValue.number).to.equal('false');
            expect(result.itemRecord.value[2].moneyValue.number).to.equal('true');
            expect(result.itemRecord.value[2].moneyValue['$t']).to.equal('104.95');
            expect(result.itemRecord.value[2].moneyValue.text).to.equal('123.45');
            expect(result.itemRecord.value[8].text['$t']).to.equal('42.42');
            done();
        });

        it('works with coercion as an optional object', function(done) {

            var result = parser.toJson(data, {reversible: true, coerce: {text:String}, object: true});
            expect(result.itemRecord.value[0].longValue['$t']).to.equal(12345);
            expect(result.itemRecord.value[1].stringValue.number).to.equal(false);
            expect(result.itemRecord.value[2].moneyValue.number).to.equal(true);
            expect(result.itemRecord.value[2].moneyValue['$t']).to.equal(104.95);
            expect(result.itemRecord.value[2].moneyValue.text).to.equal('123.45');
            expect(result.itemRecord.value[8].text['$t']).to.equal('42.42');
            done();
        });
    })

    describe('alternateTextNode', function () {

        it('A1: defaults without the option being defined', function(done) {

            var xml = internals.readFixture('alternate-text-node-A.xml');
            var result = parser.toJson(xml, {reversible: true});
            var json = internals.readFixture('alternate-text-node-A.json');
            
            expect(result).to.equal(json);

            done();
        });

        it('A2: defaults with option as false', function(done) {

            var xml = internals.readFixture('alternate-text-node-A.xml');
            var result = parser.toJson(xml, {alternateTextNode: false, reversible: true});
            var json = internals.readFixture('alternate-text-node-A.json');
            
            expect(result).to.equal(json);

            done();
        });

        
        it('B: uses alternate text node with option as true', function(done) {

            var xml = internals.readFixture('alternate-text-node-A.xml');
            var result = parser.toJson(xml, {alternateTextNode: true, reversible: true});
            var json = internals.readFixture('alternate-text-node-B.json');

            expect(result).to.equal(json);

            done();
        });
        
        it('C: overrides text node with option as "xx" string', function(done) {

            var xml = internals.readFixture('alternate-text-node-A.xml');
            var result = parser.toJson(xml, {alternateTextNode: "xx", reversible: true});
            var json = internals.readFixture('alternate-text-node-C.json');
            
            expect(result).to.equal(json);

            done();
        });

        it('D: double check sanatize and trim', function (done) {

            var xml = internals.readFixture('alternate-text-node-D.xml');
            var result = parser.toJson(xml, {alternateTextNode: "zz", sanitize: true, trim: true, reversible: true});
            var json = internals.readFixture('alternate-text-node-D.json');

            expect(result).to.equal(json);

            done();
        });

    })
});


describe('json2xml', function () {

    it('converts domain to json', function (done) {

        var json = internals.readFixture('domain-reversible.json');
        var result = parser.toXml(json);
        var xml = internals.readFixture('domain.xml');

        expect(result+'\n').to.equal(xml);

        done();
    });

    it('works with array notation', function (done) {

        var xml = internals.readFixture('array-notation.xml');
        var expectedJson = JSON.parse( internals.readFixture('array-notation.json') );

        var json = parser.toJson(xml, {object: true, arrayNotation: true});

        expect(json).to.equal(expectedJson);

        done();
    });
});


internals.readFixture = function (file) {

    return fs.readFileSync(__dirname + '/fixtures/' + file, { encoding: 'utf-8' });
};
