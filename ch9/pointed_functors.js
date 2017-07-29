var _ = require('ramda');

// IO
var IO = function(f) {
  this.__value = f;
};

IO.of = function(x) {
  return new IO(function() {
    return x;
  });
};

IO.prototype.map = function(f) {
  return new IO(_.compose(f, this.__value));
};

var concat = _.curry(function(x1, x2) {
    if (typeof x1 === typeof x2) {
        return _.concat(x1, x2);
    } else {
        return x1 + x2;
    }
});

tetrisPhrase = IO.of('tetris').map(_.flip(concat)(' master'));
console.log(tetrisPhrase.__value());
// IO('tetris master')
