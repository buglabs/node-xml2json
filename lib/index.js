var expat = require('node-expat');
var fs = require('fs');
var parser = new expat.Parser('UTF-8');

// This object will hold the final result.
var obj = {};
var currentParent = obj;
var ancestors = [];

function startElement(name, attrs) {
  if (! (name in currentParent)) {
    currentParent[name] = attrs;
  } else if (!(currentParent[name] instanceof Array)) {
    // Put the existing object in an array.
    var newArray = [currentParent[name]];
    // Add the new object to the array.
    newArray.push(attrs);
    // Point to the new array.
    currentParent[name] = newArray;
  } else {
    // An array already exists, push the attributes on to it.
    currentParent[name].push(attrs);
  }

  // Store the current (old) parent.
  ancestors.push(currentParent);

  // We are now working with this object, so it becomes the current parent.
  if (currentParent[name] instanceof Array) {
    // If it is an array, get the last element of the array.
    currentParent = currentParent[name][currentParent[name].length - 1];
  } else {
    // Otherwise, use the object itself.
    currentParent = currentParent[name];
  }
}

function charData(data) {
    data = data.trim();
    if (!data.length) {
        return;
    }
    currentParent['$t'] = data;
}

function endElement(name) {
    // This should check to make sure that the name we're ending 
    // matches the name we started on.

    var ancestor = ancestors.pop();
    if ((Object.keys(currentParent).length == 1) && ('$t' in currentParent)) {
        if (ancestor[name] instanceof Array) {
            //console.log("list-replacing $t in " + name);
            ancestor[name].push(ancestor[name].pop()['$t']);
        } else {
            //console.log("replacing $t in " + name);
            ancestor[name] = currentParent['$t'];
        }
    } else {
        //console.log("final " + name + ":");
        //console.log(currentParent);
    }

    currentParent = ancestor;
}

parser.on('startElement', startElement);
parser.on('text', charData);
parser.on('endElement', endElement);

module.exports.toJson = function(xml, _object) {
    _object = _object || false;
    if(parser.parse(xml)) {
        if(_object) {
            return obj;
        }
        return JSON.stringify(obj);
    }
};


