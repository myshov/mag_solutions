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




//  log :: a -> IO a
var log = function(x) {
  return new IO(function() {
    console.log(x);
    return x;
  });
};

//  setStyle :: Selector -> CSSProps -> IO DOM
var setStyle = curry(function(sel, props) {
  return new IO(function() {
    console.log('style is setted')
    return 'done'; //jQuery(sel).css(props);
  });
});

//  getItem :: String -> IO String
var getItem = function(key) {
  return new IO(function() {
    console.log('item is gotten')
    return "{\"background\": \"green\"}";
  });
};

//  applyPreferences :: String -> IO DOM
var applyPreferences = compose(
  join, map(setStyle('#main')), join, map(log), map(JSON.parse), getItem
);


applyPreferences('preferences').unsafePerformIO();
