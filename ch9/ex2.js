var fs = require('fs');
var _ = require('ramda');
var curry = _.curry;
var compose = _.compose;
//  map :: Functor f => (a -> b) -> f a -> f b
var map = curry(function(f, any_functor_at_all) {
  return any_functor_at_all.map(f);
});

var join = function(functor) {
    return functor.join();
};


// IO
var IO = function(f) {
  this.unsafePerformIO = f;
};

IO.of = function(x) {
  return new IO(function() {
    return x;
  });
};

IO.prototype.map = function(f) {
  return new IO(_.compose(f, this.unsafePerformIO));
};

IO.prototype.join = function() {
  var thiz = this;
  return new IO(function() {
    return thiz.unsafePerformIO().unsafePerformIO();
  });
};


// chain :: Monad m => (a -> m b) -> m a -> m b
var chain = curry(function(f, m) {
    return m.map(f).join();
});

var getFile = function() {
  return new IO(function() {
    return __filename;
  });
};

var pureLog = function(x) {
  return new IO(function() {
    console.log(x);
    return 'logged ' + x;
  });
};

var deleteFile = function(filename) {
    return new IO(function() {
        fs.unlinkSync(filename);
        return filename;
    })
}

var ex2 = compose(
    chain(pureLog), chain(deleteFile), getFile
);

ex2().unsafePerformIO()
