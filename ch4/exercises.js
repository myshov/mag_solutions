var R = require('ramda');

var curry = R.curry;

var match = curry(function(what, str) {
  return str.match(what);
});

var replace = curry(function(what, replacement, str) {
  return str.replace(what, replacement);
});

var filter = curry(function(f, ary) {
  return ary.filter(f);
});

var map = curry(function(f, ary) {
  return ary.map(f);
});

// Exercise 1
//==============
// Refactor to remove all arguments by partially applying the function.
/*
var words = function(str) {
    return R.split(' ', str);
}
*/
var words = R.split(' ');

//console.log(words('some words'));

// Exercise 1a
//==============
// Use map to make a new words fn that works on an array of strings.

//var sentences = undefined;
var sentences = R.map(words);

//console.log(sentences(['fist sentence here', 'second sentences']));


// Exercise 2
//==============
// Refactor to remove all arguments by partially applying the functions.

var filterQs = function(xs) {
  return R.filter(function(x) {
    return match(/q/i, x);
  }, xs);
};

var filterQs = R.filter(match(/q/i));

//console.log(filterQs('someqhereQe'));

// Exercise 3
//==============
// Use the helper function _keepHighest to refactor max to not reference any
// arguments.

// LEAVE BE:
var _keepHighest = function(x, y) {
  return x >= y ? x : y;
};


// REFACTOR THIS ONE:
/*
var max = function(xs) {
  return R.reduce(function(acc, x) {
    return _keepHighest(acc, x);
  }, -Infinity, xs);
};
*/

var max = R.reduce(_keepHighest, -Infinity);

//console.log(max([10,2,234,2]))


// Bonus 1:
// ============
// Wrap array's slice to be functional and curried.
// //[1, 2, 3].slice(0, 2)
//var slice = curry(Array.slice);
//
var slice = curry(function (start, end, ary) {
    return ary.slice(start, end);
});

//console.log([1, 2, 3].slice(0, 2))

console.log(slice(0)(3)([1,2,3]))

// Bonus 2:
// ============
// Use slice to define a function "take" that returns n elements from the beginning of an array. Make it curried.
// For ['a', 'b', 'c'] with n=2 it should return ['a', 'b'].
var take = slice(0);

console.log(take(2, ['a', 'b', 'c']));
