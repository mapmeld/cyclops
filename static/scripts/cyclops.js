if (typeof module !== 'undefined') {
  var prompt = require('readline-sync').question;
}

var numberConversion = function (raw) {
  return raw;
};

function cyclops(srccode, langname, cmds, callback, logme) {
  if (!logme) {
    logme = console.log;
  }
  var logger = function (raw) {
    logme(numberConversion(raw));
  };
  var keys = ['xLOOPx', 'xSWITCHx', 'xSWITCHEDx', 'xSUBTRACTx', 'xDIVIDEx', 'xMULTIPLYx',
             'xBREAKx', 'xFUNCENDx', 'xFUNCSTARTx', 'xPARAMONEx', 'xPARAMTWOx', 'xPARAMTHREEx',
             'xPARAMFOURx', 'xPARAMFIVEx', 'xPRINTx', 'xINPUTx', 'xHELPx',
             'xRANDx', 'xGREATERx', 'xLESSERx', 'xDUBEQUALx', 'xADDx', 'xSTOREx'];
  for (var k = 0; k < keys.length; k++) {
    if (cmds[keys[k]]) {
      keys[k] = cmds[keys[k]];
    }
  }

  var lines = srccode.trim().split(/\r\n|\n/);

  var glovars = {};
  var glofunc = {};
  var loops = [];
  var conditionals = [];
  var inFunction = false;
  var params = [];
  var response;

  function parseLine(i) {
    if (i >= lines.length) {
      return callback(null, numberConversion(response));
    }

    var parser = lines[i];

    /*
    // block Arabic numerals
    if (parser.match(/\d/)) {
      throw 'An error occurred: Arabic numerals not allowed.';
    }
    */

    // convert numerals
    parser = (numberConversion(parser, true) + '');
    // split into parts
    parser = parser.trim().split(/\s+/);
    var line = [];
    for (var p = 0; p < parser.length; p++) {
      /*
      // recombine line so spaced out strings still work
      if (p && !(parser[p] + parser[p-1]).match(/\d/)) {
        line[line.length - 1] += ' ' + parser[p];
      } else {
      */
        line.push(parser[p]);
      //}
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
      if (parts.length === 1) {
        parts = parts[0].split(/\s+/);
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

      if (inFunction) {
        if (part === cmds.xFUNCENDx) {
          return response;
        }
        if (part === cmds.xPARAMONEx) {
          part = params[0];
        }
        if (part === cmds.xPARAMTWOx) {
          part = params[1];
        }
        if (part === cmds.xPARAMTHREEx) {
          part = params[2];
        }
        if (part === cmds.xPARAMFOURx) {
          part = params[3];
        }
        if (part === cmds.xPARAMFIVEx) {
          part = params[4];
        }
      }

      if (!isNaN(part * 1)) {
        // number
        return parseCode(initialVal * 1 + part * 1, parts.slice(1));
      } else if (keys.indexOf(part) > -1) {
        // help command
        if (part === cmds.xHELPx) {
          var printed = langname + ' 1.0.0';
          logger(printed);
          return printed;
        }

        // print command
        else if (part === cmds.xPRINTx) {
          var printed = parseCode('', parts.slice(1));
          logger(printed);
          return printed;
        }

        // input command
        else if (part === cmds.xINPUTx) {
          var promptStr = parseCode('', parts.slice(1));
          return numberConversion(prompt(promptStr), true);
        }

        // loop start or end
        else if (part === cmds.xLOOPx) {
          if (loops.length) {
            i = loops[0];
            return 1;
          } else {
            loops.push(i);
            return 1;
          }
        }

        // addition operator
        else if (part === cmds.xADDx) {
          var adder = parseCode(0, parts.slice(1));
          if (isNaN(adder * 1)) {
            throw 'No number to add on line ' + (i + 1);
          }
          return initialVal * 1 + adder * 1;
        }

        // subtraction operator
        else if (part === cmds.xSUBTRACTx) {
          var subtractor = parseCode(0, parts.slice(1));
          if (isNaN(subtractor * 1)) {
            throw 'No number to subtract on line ' + (i + 1);
          }
          return initialVal - subtractor;
        }

        // multiplication operator
        else if (part === cmds.xMULTIPLYx) {
          var multiplier = parseCode(0, parts.slice(1));
          if (isNaN(multiplier * 1)) {
            throw 'No number to multiply on line ' + (i + 1);
          }
          return initialVal * multiplier;
        }

        else if (part === cmds.xSTOREx) {
          var value = parseCode(0, parts.slice(1));
          return value;
        }

        // division operator
        else if (part === cmds.xDIVIDEx) {
          var divisor = parseCode(0, parts.slice(1));
          if (isNaN(divisor * 1)) {
            throw 'No number to divide on line ' + (i + 1);
          }
          return initialVal / divisor;
        }

        // random number function
        else if (part === cmds.xRANDx) {
          return Math.ceil(Math.random() * 100);
        }

        // conditional
        else if (part === cmds.xSWITCHx) {
          var conditionalVal = parseCode(0, parts.slice(1));
          conditionals.push(conditionalVal);
        }

        // end conditional
        else if (part === cmds.xSWITCHEDx) {
          if (!conditionals.length) {
            throw 'too many end-if marks';
          }
          conditionals.pop();
        }

        // greater than, less than, equal to
        else if ([cmds.xGREATERx, cmds.xLESSERx, cmds.xDUBEQUALx].indexOf(part) > -1) {
          if (!conditionals.length) {
            throw 'comparison without conditional';
          }
          var compareVal = parseCode(0, parts.slice(1));
          var conditionalVal = conditionals[conditionals.length - 1];
          var correct;
          if (part === cmds.xGREATERx) {
            correct = conditionalVal > compareVal;
          }
          if (part === cmds.xLESSERx) {
            correct = conditionalVal < compareVal;
          }
          if (part === cmds.xDUBEQUALx) {
            correct = (conditionalVal == compareVal);
          }
          if (!correct) {
            /* skip to next interesting conditional */
            i++;
            while (i < lines.length
              && lines[i].indexOf(cmds.xGREATERx) === -1
              && lines[i].indexOf(cmds.xLESSERx) === -1
              && lines[i].indexOf(cmds.xDUBEQUALx) === -1
              && lines[i].indexOf(cmds.xSWITCHEDx) === -1) {
              i++;
            }
            i--;
          }
          return correct;
        }

        // break loop flag
        else if (part === cmds.xBREAKx) {
          if (!loops.length) {
            throw 'break loop flag without loop';
          }
          while (i < lines.length && lines[i].indexOf(cmds.xLOOPx) === -1) {
            i++;
          }
          loops.pop();
          return 1;
        }

        // start function
        else if (part === cmds.xFUNCSTARTx) {
          if (parts.length <= 1) {
            throw 'function did not have valid name';
          }
          var myname = parts[1];
          if (!glofunc[myname]) {
            // declare function
            var start = i;
            while (i < lines.length && lines[i].indexOf(cmds.xFUNCENDx) === -1) {
              i++;
            }
            glofunc[myname] = [start, i];
          } else {
            i = glofunc[myname][1];
          }
        } else {
          // one symbol but not a keyword
          return '';
        }
      } else if (glofunc[part] || glovars[part]) {
        // check if it's a function
        if (glofunc[part]) {
          response = runFunction(part, parts.slice(1));
          return response;
        } else {
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
      } else if (firstPart) {
        glovars[part] = parseCode('', parts.slice(1));
      } else {
        return parseStringOrVar(part) + parseCode('', parts.slice(1));
      }
    }

    var resultOfLine = parseCode(Infinity, line) + '';
    if (resultOfLine[0] === '0') {
      resultOfLine = resultOfLine.substring(1);
    }
    response = numberConversion(resultOfLine).trim();
    if (inFunction) {
      return response;
    }
    parseLine(i + 1);
  }

  try {
    parseLine(0);
  } catch(e) {
    callback(e);
  }

  function runFunction(func, prm) {
    params = prm;
    inFunction = true;
    response = parseLine(glofunc[func][0] + 1);
    inFunction = false;
    return response;
  }
}

/* polyfills */
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {
    var k;
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    var o = Object(this);
    var len = o.length >>> 0;
    if (len === 0) {
      return -1;
    }
    var n = fromIndex | 0;
    if (n >= len) {
      return -1;
    }
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
    while (k < len) {
      if (k in o && o[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}

/* NodeJS module */
if (typeof module !== 'undefined') {
  module.exports = cyclops;
}
