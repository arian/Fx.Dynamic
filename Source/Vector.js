

var Vector = function(){
	 Array.flatten(arguments).each(function(i){
		  this.push(i);
	 }, this)
};

Vector.prototype = {length: 0};
Vector.parent = Array;

new Type('Vector', Vector);

Vector.implement({

	push: function(){
		var length = this.length;
		for (var i = 0, l = arguments.length; i < l; i++){
			this[length++] = +arguments[i];
		}
		return (this.length = length);
	}.protect(),

	map: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++) this[i] = fn.call(bind, this[i], i);
		return this;
	}.protect(),

	augment: function(length){
		if (this.length >= length) return this;
		for (var l = (length - this.length); l--;) this.push(0);
		return this;
	}.protect(),

	times: function(v){
		return this.map(v instanceof Vector ? function(i, n){
			return i * v[n];
		} : function(i){
			return i * v;
		});
	}.protect(),

	add: function(v){
		return this.map(v instanceof Vector ? function(i, n){
			return i + v[n];
		}: function(i){
			return i + v;
		});
	}.protect(),

	sum: function(){
		var res = 0;
		for (var l = this.length; l--;) res += this[l];
		return res;
	}.protect(),

	dot: function(v){
		return this.times(v).sum();
	}.protect(),

	cross: function(y){
		var tmp = this.clone().augment(3);
		y = y.clone().augment(3);
		this[0] = tmp[1] * y[2] - tmp[2] * y[1];
		this[1] = tmp[2] * y[0] - tmp[0] * y[2];
		this[2] = tmp[0] * y[1] - tmp[1] * y[0];
		return this;
	}.protect(),

	abs: function(){
		return Math.sqrt(this.clone().dot(this.clone()));
	}.protect(),

	angle: function(v){
		v = v.clone().norm();
		var u = this.clone().norm();
		return Math.acos(u.dot(v));
	}.protect(),

	norm: function(){
		return this.times(1 / this.abs());
	}.protect(),

	clone: function(){
		return new Vector(this);
	}.protect()

});

Vector.implement(Array.prototype);
Array.mirror(Vector);
