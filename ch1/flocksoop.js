var Flock = function(n) {
  this.seagulls = n;
};

Flock.prototype.conjoin = function(other) {
  this.seagulls += other.seagulls;
  return this;
};

Flock.prototype.breed = function(other) {
  this.seagulls = this.seagulls * other.seagulls;
  return this;
};

var flock_a = new Flock(4);
var flock_b = new Flock(2);

//var result = flock_a.conjoin(flock_c).breed(flock_b).conjoin(flock_a.breed(flock_b)).seagulls;

var result = flock_a.breed(flock_b)
console.log(result.seagulls) // 8
var result2 = flock_a.breed(flock_b);
console.log(result2.seagulls) // 16
var result3 = result.conjoin(result2);
console.log(result3.seagulls) // 32
