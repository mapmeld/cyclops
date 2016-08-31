function aegean(input, convertToArabicNumerals) {
  input += '';

  var tenks = ['𐄫','𐄬','𐄭','𐄮','𐄯','𐄰','𐄱','𐄲','𐄳'];
  var ks = ['𐄢','𐄣','𐄤','𐄥','𐄦','𐄧','𐄨','𐄩','𐄪'];
  var hundreds = ['𐄙','𐄚','𐄛','𐄜','𐄝','𐄞','𐄟','𐄠','𐄡'];
  var tens = ['𐄐','𐄑','𐄒','𐄓','𐄔','𐄕','𐄖','𐄗','𐄘'];
  var ones = ['𐄇','𐄈','𐄉','𐄊','𐄋','𐄌','𐄍','𐄎','𐄏'];

  if (convertToArabicNumerals) {
    // convert from Aegean numerals to Arabic numerals
    var placevals = [ones, tens, hundreds, ks, tenks];
    var replacements = [];
    var numeralchain = 0;
    var lastpv = 100;

    for (var c = 0; c < input.length; c++) {
      var char = input.slice(c, c + 2);
      var isNumeral = false;
      for (var pv = 0; pv < placevals.length; pv++) {
        if (placevals[pv].indexOf(char) > -1) {
          if (lastpv < pv) {
            throw 'place values in wrong order';
          } else if (lastpv === pv) {
            throw 'place value repeats';
          }
          lastpv = pv;
          numeralchain += (placevals[pv].indexOf(char) + 1) * Math.pow(10, pv);
          isNumeral = true;
          c++;
          break;
        }
      }
      if (isNumeral) {
        continue;
      }

      // didn't find a digit in this char, when previous char had digits
      if (numeralchain) {
        replacements.push(numeralchain);
        numeralchain = 0;
        lastpv = 100;
      }
    }
    if (numeralchain) {
      // numeral at end of the string
      replacements.push(numeralchain);
    }
    for (var r = 0; r < replacements.length; r++) {
      input = input.replace(aegean(replacements[r]), replacements[r]);
    }
    if (!isNaN(input * 1)) {
      return input * 1;
    } else {
      return input;
    }
  } else {
    // convert from Arabic numerals to Aegean numerals
    var numerals = input.match(/[-]?\d+[\.\d+]?/g);
    if (!numerals) {
      numerals = [];
    }
    // console.log(numerals);
    for (var n = 0; n < numerals.length; n++) {
      var conversion = 1 * numerals[n];
      if (conversion !== Math.round(conversion)) {
        throw 'decimals not supported';
      }
      if (conversion === 0) {
        throw 'zero not supported';
      }
      if (conversion < 0) {
        throw 'negative numbers not supported';
      }
      if (conversion >= 100000) {
        throw 'numbers >= 100,000 not supported';
      }

      var output = '';
      while (conversion > 0) {
        var digit = 1 * (conversion + '')[0];
        if (conversion >= 10000) {
          conversion -= 10000 * digit;
          output += tenks[digit - 1];
        } else if (conversion >= 1000) {
          conversion -= 1000 * digit;
          output += ks[digit - 1];
        } else if (conversion >= 100) {
          conversion -= 100 * digit;
          output += hundreds[digit - 1];
        } else if (conversion >= 10) {
          conversion -= 10 * digit;
          output += tens[digit - 1];
        } else {
          conversion -= digit;
          output += ones[digit - 1];
        }
      }
      input = input.replace(numerals[n], output);
    }
    return input;
  }
}

/* Array.indexOf polyfill from Mozilla Dev Network */
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
    var n = +fromIndex || 0;
    if (Math.abs(n) === Infinity) {
      n = 0;
    }
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

/* NodeJS module support */
if (typeof module !== "undefined") {
  module.exports = aegean;
}
