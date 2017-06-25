var _ = require('ramda');

var join = _.curry(function(what, xs) {
    return xs.join(what);
});

var trace = _.curry(function(tag, x) {
    console.log(tag, x);
    return x;
});

console.log(join('@', [2,2,3]))

