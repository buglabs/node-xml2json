/**
 * Parses json to xml recursively.
 * @param {String|Buffer} json The JSON string to be parsed.
 * @param {String} xml The ongoing xml string
 * being generated from the json parameter.
 * @return {String} The ongoing xml.
 **/
module.exports = function toXml(json, xml) {
    xml = xml || '';
    if (Buffer.isBuffer(json)) {
        json = json.toString();
    }

    var obj = null;
    if (typeof(json) == 'string') {
        try {
            obj = JSON.parse(json);
        } catch (e) {
            throw new Error('The JSON structure is invalid');
        }
    } else {
        obj = json;
    }

    var keys = Object.keys(obj);
    var len = keys.length;

    for (var i = 0; i < len; i++) {
        var key = keys[i];

        if (Array.isArray(obj[key])) {
            var elems = obj[key];
            var l = elems.length;
            for (var j = 0; j < l; j++) {
                xml += '<' + key + '>';
                xml = toXml(elems[j], xml);
                xml += '</' + key + '>';
            }
        } else if (typeof(obj[key]) == 'object') {
            xml += '<' + key + '>';
            xml = toXml(obj[key], xml);
            xml += '</' + key + '>';
        } else if (typeof(obj[key]) == 'string') {
            if (key == '$t') {
                xml += obj[key];
            } else {
                xml = xml.replace(/>$/, '');
                xml += ' ' + key + "='" + obj[key] + "'>";
            }
        }
    }

    return xml;
};
