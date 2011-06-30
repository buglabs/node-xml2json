var fs = require('fs');
var path = require('path');
var parser = require('../lib');
var assert = require('assert');

var fixturesPath = './fixtures';

fs.readdir(fixturesPath, function(err, files) {
    for (var i in files) {
        var file = files[i];
        var ext = path.extname(file);

        if (ext == '.xml') {
            var basename = path.basename(file, '.xml');

            var data = fs.readFileSync(fixturesPath + '/' + file);
            var result = parser.toJson(data);

            var jsonFile = basename + '.json'
            var expected = fs.readFileSync(fixturesPath + '/' + jsonFile) + '';

            if (result) {
                result = result.trim();
            }

            if (expected) {
                expected = expected.trim();
            }
            assert.deepEqual(result, expected, jsonFile + ' and ' + file + ' are different');
            console.log('All tests passed!');
        }
    }
});

