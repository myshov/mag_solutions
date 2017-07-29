var _ = require('ramda');
var curry = _.curry;
var compose = _.compose;

var log = console.log;

//  map :: Functor f => (a -> b) -> f a -> f b
var map = curry(function(f, any_functor_at_all) {
  return any_functor_at_all.map(f);
});

var Left = function(x) {
  this.__value = x;
};

Left.of = function(x) {
  return new Left(x);
};

Left.prototype.map = function(f) {
  return this;
};

Left.prototype.join = function() {
  return this;
}

var Right = function(x) {
  this.__value = x;
};

Right.of = function(x) {
  return new Right(x);
};

Right.prototype.map = function(f) {
  return Right.of(f(this.__value));
}

Right.prototype.join = function() {
  return Right.of(this.__value);
}


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

// Exercise 4
// ==========
// Use validateEmail, addToMailingList, and emailBlast to implement ex4's type
// signature.

//  addToMailingList :: Email -> IO([Email])
var addToMailingList = (function(list) {
  return function(email) {
    return new IO(function() {
      list.push(email);
      return list;
    });
  };
})([]);

function emailBlast(list) {
  return new IO(function() {
    return 'emailed: ' + list.join(',');
  });
}

var validateEmail = function(x) {
  return x.match(/\S+@\S+\.\S+/) ? (new Right(x)) : (new Left('invalid email'));
};

var pureLog = function(x) {
  return new IO(function() {
    console.log(x);
    return 'logged ' + x;
  });
};

//  ex4 :: Email -> Either String (IO String)
var ex4 = compose(
    chain(chain(pureLog)), chain(chain(emailBlast)), chain(addToMailingList), validateEmail
);

var result = ex4('my@great.com')
if (result instanceof Left) {
    console.log(result.__value);
} else {
    result.__value.unsafePerformIO();
}
