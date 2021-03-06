var _ = require('ramda');
var curry = _.curry;
var compose = _.compose;

//  map :: Functor f => (a -> b) -> f a -> f b
var map = curry(function(f, any_functor_at_all) {
  return any_functor_at_all.map(f);
});

// chain :: Monad m => (a -> m b) -> m a -> m b
var chain = curry(function(f, m) {
    return m.map(f).join();
});

var join = function(functor) {
    return functor.join();
};

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
}

//  safeProp :: Key -> {Key: a} -> Maybe a
var safeProp = curry(function(x, obj) {
  return new Maybe(obj[x]);
});

//  safeHead :: [a] -> Maybe a
var safeHead = safeProp(0);

var user = {
    id: 2,
    name: 'albert',
    address: {
        street: {
            number: 22,
            name: 'Walnut St',
        },
    },
};

//  getSteetName :: User -> Maybe (Maybe (Maybe Street) )
var getStreetName = compose(
  chain(safeProp('street')), safeProp('address')
);

var res = getStreetName(user);

console.log(JSON.stringify(res, null, 2));
