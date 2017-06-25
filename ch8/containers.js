var _ = require('ramda');

var log = console.log;
var Container = function (x) {
    this.__value = x;
};

Container.of = function (x) {return new Container(x);};

Container.prototype.map = function (f) {
    return Container.of(f(this.__value));
}

var containerOne = Container.of(1);
var containerTwo = containerOne.map(function (one) {
    return one + 1;
});
log(containerTwo)

var uppercased = Container.of("flamethrowers").map(function(s) {
  return s.toUpperCase();
});
log(uppercased)


var lenghtOfPhrase = Container.of("bombs").map(_.concat(' away')).map(_.prop('length'));
log(lenghtOfPhrase)
