var moment = require('moment');
var _ = require('ramda');
var curry = _.curry;
var concat = curry(function(x1, x2) {
    if (typeof x1 === typeof x2) {
        return _.concat(x1, x2);
    } else {
        return x1 + x2;
    }
});
var compose = _.compose;
var add = _.add;

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

var Right = function(x) {
  this.__value = x;
};

Right.of = function(x) {
  return new Right(x);
};

Right.prototype.map = function(f) {
  return Right.of(f(this.__value));
}
//  getAge :: Date -> User -> Either(String, Number)
var getAge = curry(function(now, user) {
  var birthdate = moment(user.birthdate, 'YYYY-MM-DD');
  if (!birthdate.isValid()) return Left.of('Birth date could not be parsed');
  return Right.of(now.diff(birthdate, 'years'));
});

//  fortune :: Number -> String
var fortune = compose(concat('If you survive, you will be '), add(1));

//  zoltar :: User -> Either(String, _)
var zoltar = compose(map(console.log), map(fortune), getAge(moment()));

/*
zoltar({
  birthdate: '2007-12-12',
});
*/
// 'If you survive, you will be 10'
// Right(undefined)

/*
zoltar({
  birthdate: 'balloons!',
});
*/
// Left('Birth date could not be parsed')
//
//
//
//  either :: (a -> c) -> (b -> c) -> Either a b -> c
var either = curry(function(f, g, e) {
  switch (e.constructor) {
    case Left:
      return f(e.__value);
    case Right:
      return g(e.__value);
  }
});

//  zoltar :: User -> _
var zoltar = compose(console.log, either(_.identity, fortune), getAge(moment()));

zoltar({
  birthdate: '2007-12-12',
});
// "If you survive, you will be 10"
// undefined

zoltar({
  birthdate: 'balloons!',
});
