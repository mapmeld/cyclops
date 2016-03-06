
var assert = require('assert');
var cyclops = require('../cyclops');

describe('print', function() {
  it('should return helpful output for 𐙀', function(done) {
    cyclops('𐙀', function (err, output) {
      if (err) {
        done(err);
      } else {
        assert.equal(output, 'Cyclops𐙀 CyclopsLang.org');
        done();
      }
    });
  });

  it('should return string for 𐜝', function(done) {
    cyclops('𐜝 banana man', function (err, output) {
      if (err) {
        done(err);
      } else {
        assert.equal(output, 'banana man');
        done();
      }
    });
  });

  it('should print completed math', function(done) {
    cyclops('𐜝 𐄋 𐄋', function (err, output) {
      if (err) {
        done(err);
      } else {
        assert.equal(output, '𐄐');
        done();
      }
    });
  });

  it('should print the value of a variable', function(done) {
    cyclops('𐘾𐘾 𐄋\n𐜝 𐘾𐘾', function (err, output) {
      if (err) {
        done(err);
      } else {
        assert.equal(output, '𐄋');
        done();
      }
    });
  });

  it('should modify and print the new value of a variable', function(done) {
    cyclops('𐘾𐘾 𐄋\n𐘾𐘾 𐄋 𐘾𐘾\n𐜝 𐘾𐘾', function (err, output) {
      if (err) {
        done(err);
      } else {
        assert.equal(output, '𐄐');
        done();
      }
    });
  });
});

describe('numerals', function() {
  it('should return 𐄐 (10) for 𐄐', function(done) {
    cyclops('𐄐', function (err, output) {
      if (err) {
        done(err);
      } else {
        assert.equal(output, '𐄐');
        done();
      }
    });
  });

  it('should return 𐄒 (30) for adding 𐄐 𐄐 𐄐', function(done) {
    cyclops('𐄐 𐄐 𐄐', function (err, output) {
      if (err) {
        done(err);
      } else {
        assert.equal(output, '𐄒');
        done();
      }
    });
  });

  it('should return 𐄐 (10) for subtracting 𐄐𐄋 𐝔 𐄋', function(done) {
    cyclops('𐄐𐄋 𐝔 𐄋', function (err, output) {
      if (err) {
        done(err);
      } else {
        assert.equal(output, '𐄐');
        done();
      }
    });
  });

  it('should return 𐄑𐄋 (25) for multiplying 𐄋 𐙨 𐄋', function(done) {
    cyclops('𐄋 𐙨 𐄋', function (err, output) {
      if (err) {
        done(err);
      } else {
        assert.equal(output, '𐄑𐄋');
        done();
      }
    });
  });

  it('should return 𐄋 (5) for dividing 𐄑𐄋 𐝑 𐄋', function(done) {
    cyclops('𐄑𐄋 𐝑 𐄋', function (err, output) {
      if (err) {
        done(err);
      } else {
        assert.equal(output, '𐄋');
        done();
      }
    });
  });

  it('order of operations should return 𐄑 (20) for 3 + 2 * 4', function(done) {
    cyclops('𐄉 𐄈 𐙨 𐄊', function (err, output) {
      if (err) {
        done(err);
      } else {
        assert.equal(output, '𐄑');
        done();
      }
    });
  });
});
