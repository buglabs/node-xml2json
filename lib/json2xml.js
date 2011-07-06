var xml = '';
module.exports = function toXml(json) {
    if (json instanceof Buffer) {
        json = json.toString();
    }

    var obj = null;
    if (typeof(json) == 'string') {
        try {
            obj = JSON.parse(json);
        } catch(e) {
            throw new Error("The JSON structure is invalid");
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
                toXml(elems[j]);
                xml += '</' + key + '>';
            }
        } else if (typeof(obj[key]) == 'object') {
            xml += '<' + key + '>';
            toXml(obj[key]);
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

