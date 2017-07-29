var Task = require('data.task');
var _ = require('ramda');




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

// chain :: Monad m => (a -> m b) -> m a -> m b
var chain = _.curry(function(task2, task1) {
    return task1.chain(task2);
});


// Exercise 3
// ==========
// Use getPost() then pass the post's id to getComments().
//
var getPost = function(i) {
  return new Task(function(rej, res) {
    setTimeout(function() {
      res({
        id: 2,
        title: 'Love them futures',
      });
    }, 300);
  });
};


var getComments = function(i) {
  return new Task(function(rej, res) {
    setTimeout(function() {
      res([{
        post_id: i,
        body: 'This book should be illegal',
      }, {
        post_id: i,
        body: 'Monads are like smelly shallots',
      }]);
    }, 300);
  });
};

var getId = function(post) {
    return(post.id);
};

var ex3 = _.compose(chain(getComments), map(getId), getPost);
ex3(10).fork(_.identity, console.log);
