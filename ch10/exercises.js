//require('./support');
var Task = require('data.task');
var _ = require('ramda');


// Maybe
//

var Maybe = function(x) {
    this.__value = x;
};

Maybe.of = function(x) {
    return new Maybe(x);
};

Maybe.prototype.isNothing = function() {
    return (this.__value === null || this.__value === undefined);
};

Maybe.prototype.map = function(f) {
    return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
};

Maybe.prototype.join = function() {
  return this.isNothing() ? Maybe.of(null) : this.__value;
};

Maybe.prototype.ap = function(other_functor) {
    return other_functor.map(this.__value);
};


// IO
//

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

IO.prototype.ap = function(other_functor) {
    return other_functor.map(this.unsafePerformIO());
};



var liftA2 = _.curry(function(f, functor1, functor2) {
    return functor1.map(f).ap(functor2);
});

// fib browser for test
var localStorage = {};



// Exercise 1
// ==========
// Write a function that adds two possibly null numbers together using Maybe and ap().

//  ex1 :: Number -> Number -> Maybe Number
var ex1 = function(x, y) {
  return Maybe.of(_.add).ap(Maybe.of(x)).ap(Maybe.of(y))
};


// Exercise 2
// ==========
// Now write a function that takes 2 Maybe's and adds them. Use liftA2 instead of ap().

//  ex2 :: Maybe Number -> Maybe Number -> Maybe Number
var ex2 = liftA2(_.add);



// Exercise 3
// ==========
// Run both getPost(n) and getComments(n) then render the page with both. (The n arg is arbitrary.)
var makeComments = _.reduce(function(acc, c) { return acc+"<li>"+c+"</li>" }, "");
var render = _.curry(function(p, cs) { return "<div>"+p.title+"</div>"+makeComments(cs); });

//  ex3 :: Task Error HTML
var ex3 = Task.of(render).ap(getPost(1)).ap(getComments(1));



// Exercise 4
// ==========
// Write an IO that gets both player1 and player2 from the cache and starts the game.
localStorage.player1 = "toby";
localStorage.player2 = "sally";

var getCache = function(x) {
  return new IO(function() { return localStorage[x]; });
};
var game = _.curry(function(p1, p2) { return p1 + ' vs ' + p2; });

//  ex4 :: IO String
var ex4 = IO.of(game).ap(getCache('player1')).ap(getCache('player2'));





// TEST HELPERS
// =====================

function getPost(i) {
  return new Task(function (rej, res) {
    setTimeout(function () { res({ id: i, title: 'Love them futures' }); }, 300);
  });
}

function getComments(i) {
  return new Task(function (rej, res) {
    setTimeout(function () {
      res(["This book should be illegal", "Monads are like space burritos"]);
    }, 300);
  });
}
