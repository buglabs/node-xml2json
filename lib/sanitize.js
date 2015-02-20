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
var chars =  {
	'<': '&lt;',
    '>': '&gt;',
    '(': '&#40;',
    ')': '&#41;',
    '#': '&#35;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;'
};

exports.sanitize = function sanitize(value) {
    if (typeof value !== 'string') {
        return value;
    }

    Object.keys(chars).forEach(function(key) {
        value = value.replace(key, chars[key]);
    });

    return value;
}