if (typeof module !== 'undefined') {
  const aegean = require('aegean-numbers');
}

// trim() polyfill

function cyclops(srccode, callback) {
  var lines = srccode.split(/\r\n|\n/);

  var glovars = {};

  function parseLine(i) {
    if (i >= lines.length) {
      return callback(null, lines[0]);
    }

    var line = lines[i];
    // block Arabic numerals
    if (line.match(/\d/)) {
      return callback('An error occurred: Arabic numerals not allowed.');
    }
    // convert numerals
    line = (aegean(line, true) + '');
    // split into parts
    line = line.trim().split(/\s+/);

    // get a result for this line
    var resultOfLine = 0;
    function parsePart(p) {
      if (p >= line.length) {
        lines[i] = aegean(resultOfLine);
        return parseLine(i + 1);
      }
      var part = line[p];

      if (!isNaN(part * 1)) {
        // number
        part = part * 1;
        resultOfLine += part;
      } else if (part.length === 2) {
        // help command
        if (part === '𐙀') {
          resultOfLine = 'Cyclops𐙀 CyclopsLang.org';
        }

        // subtraction command
        if (part === '𐝔') {
          if (line.length < p) {
            return callback('No number to subtract on line ' + (i + 1));
          }
          var subtractor = line[p + 1] * 1;
          if (isNaN(subtractor)) {
            return callback('No number to subtract on line ' + (i + 1));
          }
          resultOfLine -= subtractor;
          return parsePart(p + 2);
        }

        // multiplication command
        if (part === '𐙨') {
          if (line.length < p) {
            return callback('No number to multiply on line ' + (i + 1));
          }
          var subtractor = line[p + 1] * 1;
          if (isNaN(subtractor)) {
            return callback('No number to multiply on line ' + (i + 1));
          }
          resultOfLine *= subtractor;
          return parsePart(p + 2);
        }

        // division command
        if (part === '𐝑') {
          if (line.length < p) {
            return callback('No number to divide on line ' + (i + 1));
          }
          var subtractor = line[p + 1] * 1;
          if (isNaN(subtractor)) {
            return callback('No number to divide on line ' + (i + 1));
          }
          resultOfLine /= subtractor;
          return parsePart(p + 2);
        }

        // entering a conditional
        if (part === '𐘜') {
          evalVal(line.slice(1));
        }

        // print command
        if (part === '𐜝') {
          resultOfLine = line.slice(p + 1, 100)[0];
          console.log(resultOfLine);
        }
      }
      parsePart(p + 1);
    }
    parsePart(0);
  }
  parseLine(0);
}

if (typeof module !== 'undefined') {
  module.exports = cyclops;
}
