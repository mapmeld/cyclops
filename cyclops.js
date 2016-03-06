if (typeof module !== 'undefined') {
  const aegean = require('aegean-numbers');
  const prompt = require('readline-sync').question;
}

function isLinearA(txt) {
  for (var c = 0; c < txt.length; c++) {
    var cdpt = txt.codePointAt(c);
    if (c % 2) {
      if (cdpt < 56832 || cdpt > 57191) {
        return false;
      }
    } else if (cdpt < 67072 || cdpt > 67431) {
      return false;
    }
  }
  return true;
}

function cyclops(srccode, callback) {
  var lines = srccode.trim().split(/\r\n|\n/);

  var glovars = {};
  var loops = [];
  var conditionals = [];
  var response;

  function parseLine(i) {
    if (i >= lines.length) {
      return callback(null, response);
    }

    var parser = lines[i];
    // block Arabic numerals
    if (parser.match(/\d/)) {
      return callback('An error occurred: Arabic numerals not allowed.');
    }
    // convert numerals
    parser = (aegean(parser, true) + '');
    // split into parts
    parser = parser.trim().split(/\s+/);
    var line = [];
    for (var p = 0; p < parser.length; p++) {
      // recombine line so spaced out strings still work
      if (p && !(parser[p] + parser[p-1]).match(/\d/) && !isLinearA(parser[p -1]) && !isLinearA(parser[p])) {
        line[line.length - 1] += ' ' + parser[p];
      } else {
        line.push(parser[p]);
      }
    }

    // get a result for this line
    function parseCode(initialVal, parts) {
      var firstPart = false;
      if (initialVal === Infinity) {
        initialVal = 0;
        firstPart = true;
      }
      if (!parts.length) {
        return initialVal;
      }

      var part = parts[0];

      function parseStringOrVar(p) {
        if (glovars[p]) {
          if (isNaN(glovars[p] * 1)) {
            return glovars[p];
          } else {
            return glovars[p] * 1;
          }
        }
        return p;
      }

      if (!isNaN(part * 1)) {
        // number
        part = part * 1;
        var sum = parseCode(initialVal + part, parts.slice(1));
        return sum;
      } else if (part.length === 2) {
        // help command
        if (part === '𐙀') {
          var printed = 'Cyclops𐙀 CyclopsLang.org';
          console.log(printed);
          return printed;
        }

        // print command
        else if (part === '𐜝') {
          var printed = parseCode('', parts.slice(1));
          console.log(printed);
          return printed;
        }

        // input command
        else if (part === '𐝠') {
          var promptStr = parseCode('', parts.slice(1));
          if (typeof module === 'undefined') {
            return aegean(input(promptStr), true);
          } else {
            return aegean(prompt(promptStr), true);
          }
        }

        // loop start or end
        else if (part === '𐙟') {
          if (loops.length) {
            i = loops[0];
            return 1;
          } else {
            loops.push(i);
            return 1;
          }
        }

        // subtraction operator
        else if (part === '𐝔') {
          var subtractor = parseCode(0, parts.slice(1));
          if (isNaN(subtractor * 1)) {
            return callback('No number to subtract on line ' + (i + 1));
          }
          return initialVal - subtractor;
        }

        // multiplication operator
        else if (part === '𐙨') {
          var multiplier = parseCode(0, parts.slice(1));
          if (isNaN(multiplier * 1)) {
            return callback('No number to multiply on line ' + (i + 1));
          }
          return initialVal * multiplier;
        }

        // division operator
        else if (part === '𐝑') {
          var divisor = parseCode(0, parts.slice(1));
          if (isNaN(divisor * 1)) {
            return callback('No number to divide on line ' + (i + 1));
          }
          return initialVal / divisor;
        }

        // random number function
        else if (part === '𐚁') {
          return Math.ceil(Math.random() * 100);
        }

        // conditional
        else if (part === '𐘜') {
          var conditionalVal = parseCode(0, parts.slice(1));
          conditionals.push(conditionalVal);
        }

        // end conditional
        else if (part === '𐘩') {
          if (!conditionals.length) {
            return callback('too many end-if marks');
          }
          conditionals.pop();
        }

        // greater than, less than, equal to
        else if (['𐚠', '𐚡', '𐙈'].indexOf(part) > -1) {
          if (!conditionals.length) {
            return callback('comparison without conditional');
          }
          var compareVal = parseCode(0, parts.slice(1));
          var conditionalVal = conditionals[conditionals.length - 1];
          var correct;
          if (part === '𐚠') {
            correct = conditionalVal > compareVal;
          }
          if (part === '𐚡') {
            correct = conditionalVal < compareVal;
          }
          if (part === '𐙈') {
            correct = (conditionalVal == compareVal);
          }
          if (!correct) {
            /* skip to next interesting conditional */
            i++;
            while (i < lines.length
              && lines[i].indexOf('𐚠') === -1
              && lines[i].indexOf('𐚡') === -1
              && lines[i].indexOf('𐙈') === -1
              && lines[i].indexOf('𐘩') === -1) {
              i++;
            }
            i--;
          }
          return correct;
        }

        // break loop flag
        else if (part === '𐝏') {
          if (!loops.length) {
            return callback('break loop flag without loop');
          }
          while (i < lines.length && lines[i].indexOf('𐙟') === -1) {
            i++;
          }
          loops.pop();
          return 1;
        }

        else {
          // one symbol but not a keyword
          return '';
        }
      } else {
        if (isLinearA(part)) {
          // setting / retrieving variable
          if (!glovars[part]) {
            glovars[part] = '';
          }
          var combined = parseCode(initialVal + (firstPart ? '' : glovars[part]), parts.slice(1));

          if (firstPart) {
            glovars[part] = combined;
          }
          return combined;
        }
        return parseStringOrVar(part) + parseCode('', parts.slice(1));
      }
    }

    var resultOfLine = parseCode(Infinity, line) + '';
    if (resultOfLine[0] === '0') {
      resultOfLine = resultOfLine.substring(1);
    }
    response = aegean(resultOfLine).trim();
    parseLine(i + 1);
  }
  parseLine(0);
}

/* polyfills */
/*! http://mths.be/codepointat v0.1.0 by @mathias */
if (!String.prototype.codePointAt) {
  (function() {
    'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
    var codePointAt = function(position) {
      if (this == null) {
        throw TypeError();
      }
      var string = String(this);
      var size = string.length;
      // `ToInteger`
      var index = position ? Number(position) : 0;
      if (index != index) { // better `isNaN`
        index = 0;
      }
      // Account for out-of-bounds indices:
      if (index < 0 || index >= size) {
        return undefined;
      }
      // Get the first code unit
      var first = string.charCodeAt(index);
      var second;
      if ( // check if it’s the start of a surrogate pair
        first >= 0xD800 && first <= 0xDBFF && // high surrogate
        size > index + 1 // there is a next code unit
      ) {
        second = string.charCodeAt(index + 1);
        if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
          // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
          return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
        }
      }
      return first;
    };
    if (Object.defineProperty) {
      Object.defineProperty(String.prototype, 'codePointAt', {
        'value': codePointAt,
        'configurable': true,
        'writable': true
      });
    } else {
      String.prototype.codePointAt = codePointAt;
    }
  }());
}

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

/* NodeJS module */
if (typeof module !== 'undefined') {
  module.exports = cyclops;
}
