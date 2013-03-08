module.exports = function toXml(json, xml) {
    var xml = xml || '';
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

    // First pass, extract strings only
    for (var i = 0; i < len; i++) {
        var key = keys[i], value = obj[key], isArray = Array.isArray(value);
        if (typeof(obj[key]) == 'string' || isArray) {
			var it = isArray ? value : [value];

			it.forEach(function(subVal) {
				if (typeof(subVal) != 'object') {
					if (key == '$t') {
						xml += subVal;
					} else {
						xml = xml.replace(/>$/, '');
						xml += ' ' + key + '="' + subVal + '">';
					}
				}
			})
        }
    }

    // Second path, now handle sub-objects and arrays
    for (var i = 0; i < len; i++) {
        var key = keys[i];

        if (Array.isArray(obj[key])) {
            var elems = obj[key];
            var l = elems.length;
            for (var j = 0; j < l; j++) {
				var elem = elems[j];

				if (typeof(elem) == 'object') {
					xml += '<' + key + '>';
					xml = toXml(elem, xml);
					xml += '</' + key + '>';
				}
            }
        } else if (typeof(obj[key]) == 'object') {
            xml += '<' + key + '>';
            xml = toXml(obj[key], xml);
            xml += '</' + key + '>';
        }
    }

    return xml;
};

