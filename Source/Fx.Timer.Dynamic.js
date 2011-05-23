
Fx.Timer.Dynamic = new Class({

	Extends: Fx.Timer,

	options: {
		fps: 10,
		autostart: true,
		init: {
			x: [0, 0],
			v: [0, 0],
			a: [0, 0]
		},
		threshold: 0.03
	},

	initialize: function(options){
		this.parent(options);
		if (this.options.autostart) this.start();
	},

	onStart: function(){
		Object.each(this.options.init, function(value, i){
			this[i] = new Vector(value);
		}, this);
	},

	onStep: function(dt, elapsed, now){
		var x = this.x, v = this.v, a = this.a,
			threshold = this.options.threshold;
		dt /= 1000;
		x.add(v.clone().times(dt));
		v.add(a.clone().times(dt));

		if (elapsed > dt && v.abs() < threshold) this.complete();
	}

});
