var Task = require('data.task');
var _ = require('ramda');
var Maybe = require('./maybe');




// Container
var Container = function (value) {
    this.__value = value;
}

Container.of = function (value) {
    return new Container(value);
}

Container.prototype.map = function (f) {
    return new Container(f(this.__value));
}





// Either
var Left = function(x) {
  this.__value = x;
};

Left.of = function(x) {
  return new Left(x);
};

Left.prototype.map = function(f) {
  return this;
};

var Right = function(x) {
  this.__value = x;
};

Right.of = function(x) {
  return new Right(x);
};

Right.prototype.map = function(f) {
  return Right.of(f(this.__value));
}





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





// utilities
var trace = _.curry(function (tag, x) {
    console.log(tag, x);
    return x;
});

//  map :: Functor f => (a -> b) -> f a -> f b
var map = _.curry(function(f, any_functor_at_all) {
  return any_functor_at_all.map(f);
});






// exercise 1
var one = Container.of(1);
var ex1 = function (functor) {
    return _.map(_.add(1), functor);
};
console.log(ex1(one));



// exercise 2
var xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do']);
var ex2 = function (functor) {
    return functor.map(_.head);
};
console.log(ex2(xs))



// exercise 3
var safeProp = _.curry(function(x, o) {
    return Maybe.of(o[x]);
});

var user = {
    id: 2,
    name: 'Albert',
};

var ex3 = _.map(_.head, safeProp('name', user));
console.log(ex3)




// Exercise 4
// ==========
// Use Maybe to rewrite ex4 without an if statement.

var ex4 = function(n) {
    return parseInt(n);
};

var ex4 = function(value) {
    return _.map(parseInt, Maybe.of(value));
};

console.log(ex4())




// Exercise 5
// ==========
// Write a function that will getPost then toUpperCase the post's title.

// getPost :: Int -> Future({id: Int, title: String})
var getPost = function(i) {
  return new Task(function(rej, res) {
    setTimeout(function() {
      res({
        id: i,
        title: 'Love them futures',
      });
    }, 300);
  });
};

var ex5 = _.compose(_.map(_.toUpper), _.map(_.prop('title')), getPost);
//ex5(10).fork(_.identity, console.log);





// Exercise 6
// ==========
// Write a function that uses checkActive() and showWelcome() to grant access
// or return the error.

var showWelcome = _.compose(_.concat( "Welcome "), _.prop('name'));

var checkActive = function(user) {
  return user.active ? Right.of(user) : Left.of('Your account is not active');
};

var either = _.curry(function(f, g, e) {
  switch (e.constructor) {
    case Left:
      return f(e.__value);
    case Right:
      return g(e.__value);
  }
});

var ex6 = _.compose(console.log, either(_.identity, showWelcome), checkActive);
ex6({active: true, name: 'Alexander'});






// Exercise 7
// ==========
// Write a validation function that checks for a length > 3. It should return
// Right(x) if it is greater than 3 and Left("You need > 3") otherwise.

var ex7 = function(x) {
  return (x.length > 3) ? Right.of(x) : Left.of("You need > 3");
};
checkLength = _.compose(console.log, either(_.identity, _.identity), ex7);
checkLength('sdsf')






// Exercise 8
// ==========
// Use ex7 above and Either as a functor to save the user if they are valid or
// return the error message string. Remember either's two arguments must return
// the same type.


var performUnsafeIO = function (IO) {
    if (IO && typeof IO.__value == 'function') {
        IO.__value();
    }
}

var save = function(x) {
  return new IO(function() {
    console.log('SAVED USER!');
    return x + '-saved';
  });
};

var ex8 = _.compose(either(console.log, save), ex7);
performUnsafeIO(ex8('s2'));


var nested = Task.of([Right.of('pillows'), Left.of('no sleep for you')]);
var result = map(map(map(_.toUpper)), nested).fork(_.identity, _.identity);
console.log(result);
