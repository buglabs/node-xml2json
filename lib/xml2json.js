var expat = require('node-expat');
var sanitizer = require('./sanitize.js')
var joi = require('joi');
var hoek = require('hoek');

// This object will hold the final result.
var obj = {};
var currentObject = {};
var ancestors = [];
var currentElementName = null;

var options = {}; //configuration options
function startElement(name, attrs) {
    currentElementName = name;
    if(options.coerce) {
        // Looping here in stead of making coerce generic as object walk is unnecessary
        for(var key in attrs) {
            attrs[key] = coerce(attrs[key],key);
        }
    }

    if (! (name in currentObject)) {
        if(options.arrayNotation || options.forceArrays[name]) {
            currentObject[name] = [attrs];
        } else {
            currentObject[name] = attrs;
        }
    } else if (! (currentObject[name] instanceof Array)) {
        // Put the existing object in an array.
        var newArray = [currentObject[name]];
        // Add the new object to the array.
        newArray.push(attrs);
        // Point to the new array.
        currentObject[name] = newArray;
    } else {
        // An array already exists, push the attributes on to it.
        currentObject[name].push(attrs);
    }

    // Store the current (old) parent.
    ancestors.push(currentObject);

    // We are now working with this object, so it becomes the current parent.
    if (currentObject[name] instanceof Array) {
        // If it is an array, get the last element of the array.
        currentObject = currentObject[name][currentObject[name].length - 1];
    } else {
        // Otherwise, use the object itself.
        currentObject = currentObject[name];
    }
}

function text(data) {
    currentObject[textNodeName()] = (currentObject[textNodeName()] || '') + data;
}

function endElement(name) {
    if (currentObject[textNodeName()]) {
        if (options.trim) {
            currentObject[textNodeName()] = currentObject[textNodeName()].trim()
        }

        // node-expat already reverse sanitizes it whether we like it or not
        //if (options.sanitize) {
        //    currentObject[textNodeName()] = sanitizer.sanitize(currentObject[textNodeName()], true);
        //}

        currentObject[textNodeName()] = coerce(currentObject[textNodeName()],name);
    }

    if (currentElementName !== name) {
        delete currentObject[textNodeName()];
    }
    // This should check to make sure that the name we're ending
    // matches the name we started on.
    var ancestor = ancestors.pop();
    if (!options.reversible) {
        if ((textNodeName() in currentObject) && (Object.keys(currentObject).length == 1)) {
            if (ancestor[name] instanceof Array) {
                ancestor[name].push(ancestor[name].pop()[textNodeName()]);
            } else {
                ancestor[name] = currentObject[textNodeName()];
            }
        }
    }

    currentObject = ancestor;
}

function coerce(value,key) {
    if (!options.coerce || value.trim() === '') {
        return value;
    }

    if (typeof options.coerce[key] === 'function')
        return options.coerce[key](value);

    var num = Number(value);
    if (!isNaN(num)) {
        return num;
    }

    var _value = value.toLowerCase();

    if (_value == 'true') {
        return true;
    }

    if (_value == 'false') {
        return false;
    }

    return value;
}

function textNodeName() {
    return options.alternateTextNode ? typeof options.alternateTextNode === 'string' ? options.alternateTextNode : '_t' : '$t'
}


/**
 * Parses xml to json using node-expat.
 * @param {String|Buffer} xml The xml to be parsed to json.
 * @param {Object} _options An object with options provided by the user.
 * The available options are:
 *  - object: If true, the parser returns a Javascript object instead of
 *            a JSON string.
 *  - reversible: If true, the parser generates a reversible JSON, mainly
 *                characterized by the presence of the property $t.
 *  - sanitize_values: If true, the parser escapes any element value in the xml
 * that has any of the following characters: <, >, (, ), #, #, &, ", '.
 *  - alternateTextNode (boolean OR string): 
 *      If false or not specified: default of $t is used 
 *      If true, whenever $t is returned as an end point, is is substituted with _t  
 *      it String, whenever $t is returned as an end point, is is substituted with the String value (care advised)
 *
 * @return {String|Object} A String or an Object with the JSON representation
 * of the XML.
 */
module.exports = function(xml, _options) {

    _options = _options || {};
    var parser = new expat.Parser('UTF-8');

    parser.on('startElement', startElement);
    parser.on('text', text);
    parser.on('endElement', endElement);

    obj = currentObject = {};
    ancestors = [];
    currentElementName = null;

    var schema = {
        object: joi.boolean().default(false),
        reversible: joi.boolean().default(false),
        coerce: joi.alternatives([joi.boolean(), joi.object()]).default(false),
        sanitize: joi.boolean().default(true),
        trim: joi.boolean().default(true),
        arrayNotation: joi.alternatives([joi.boolean(), joi.array()]).default(false),
        alternateTextNode: [joi.boolean().default(false), joi.string().default(false)]
    };
    var validation = joi.validate(_options, schema);
    hoek.assert(validation.error === null, validation.error);
    options = validation.value;
    options.forceArrays = {};
    if (Array.isArray(options.arrayNotation)) {
        options.arrayNotation.forEach(function(i) {
            options.forceArrays[i] = true;
        });
        options.arrayNotation = false;
    }
    if (!parser.parse(xml)) {
        throw new Error('There are errors in your xml file: ' + parser.getError());
    }

    if (options.object) {
        return obj;
    }

    var json = JSON.stringify(obj);

    //See: http://timelessrepo.com/json-isnt-a-javascript-subset
    json = json.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
    
    return json;
};
