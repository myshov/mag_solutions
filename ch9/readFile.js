// Support
// ===========================
var fs = require('fs');
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


//  readFile :: String -> IO String
var readFile = function(filename) {
  return new IO(function() {
    return fs.readFileSync(filename, 'utf-8');
  });
};

//  print :: String -> IO String
var print = function(x) {
  return new IO(function() {
    console.log(x);
    return x;
  });
};

// Example
// ===========================
//  cat :: String -> IO (IO String)
var cat = _.compose(_.map(print), readFile);

// catFirstChar :: String -> IO (IO String)
var catFirstChar = _.compose(_.map(_.map(_.head)), cat)
catFirstChar('.git/config').__value().__value();

// IO(IO('[core]\nrepositoryformatversion = 0\n'))
