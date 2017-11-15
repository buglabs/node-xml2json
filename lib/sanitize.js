/**
 * Simple sanitization. It is not intended to sanitize
 * malicious element values.
 *
 * character | escaped
 *      <       &lt;
 *      >       &gt;
 *      (       &#40;
 *      )       &#41;
 *      #       &#35;
 *      &       &amp;
 *      "       &quot;
 *      '       &apos;
 */
// used for body text
var charsEscape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};

var charsUnescape = {
    '&amp;': '&',
    '&#35;': '#',
    '&lt;': '<',
    '&gt;': '>',
    '&#40;': '(',
    '&#41;': ')',
    '&quot;': '"',
    '&apos;': "'",
    "&#31;": "\u001F"
};

// used in attribute values
var charsAttrEscape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
};

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

// sanitize body text
exports.sanitize = function sanitize(value, reverse, attribute) {
    if (typeof value !== 'string') {
        return value;
    }

    var chars = reverse ? charsUnescape : (attribute ? charsAttrEscape : charsEscape);
    var keys = Object.keys(chars);
    
    keys.forEach(function(key) {
        value = value.replace(new RegExp(escapeRegExp(key), 'g'), chars[key]);
    });

    return value;
};
