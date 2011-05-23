/*
---
name: Fx.Timer
description: Contains basic timing logic animation logic to be extended by Fx.
requires: [Date.now, Array, Function, Class, Events, Options, Chain]
provides: Timer
...
*/

(function(){

var Timer = Fx.Timer = new Class({

	Implements: [Options, Events, Chain],

	options: {
		behavior: 'cancel',
		fps: 60
	},

	initialize: function(options){
		this.setOptions(options);
		this.items = [];
	},

	start: function(){
		if (this.check.apply(this, arguments)){
			this.time = 0;
			this.elapsed = 0;
			this.onStart.apply(this, arguments);
			this.startTimer(this);
			this.fireEvent('start', this.items);
		}
		return this;
	},

	cancel: function(){
		this.stopTimer(this);
		this.fireEvent('cancel', this.items);
		return this;
	},

	pause: function(){
		if (!this.timer) return this;
		this.stopTimer(this);
		this.paused = true;
		return this.fireEvent('pause', this.items);
	},

	resume: function(){
		if (this.paused){
			this.startTimer(this);
			this.paused = false;
			this.fireEvent('resume', this.items);
		}
		return this;
	},

	complete: function(){
		this.stopTimer();
		this.fireEvent('complete', this.items);
		if (!this.callChain()) this.fireEvent('chainComplete', this.items);
		return this;
	},

	isRunning: function(){
		return !!this.timer;
	},

	/* private methods */

	step: function(now){
		if (!this.time) this.time = now - this.elapsed;
		var previous = this.elapsed;
		this.elapsed = now - this.time;
		this.onStep(this.elapsed - previous, this.elapsed, now);
	},

	// overwrite these in your subclasses
	onStep: function(){},
	onStart: function(){},

	check: function(){
		if (!this.timer) return true;
		switch (this.options.behavior){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(this.caller.pass(arguments, this)); return false;
		}
		return false;
	},

	stopTimer: function(){
		if (!this.timer) return;
		this.time = null;
		this.timer = this.stepper && Timer.remove(this.stepper, this.options.fps);
	},

	startTimer: function(){
		if (this.timer) return;
		this.timer = Timer.add(this.stepper || (this.stepper = this.step.bind(this)), this.options.fps);
	}

});

// global timer
// replace for https://github.com/kamicane/mootools-core/blob/05a862ead25fbec32d9/Source/Utilities/Timer.js ??
var functions = {}, timers = {};

var loop = function(){
	var now = Date.now();
	for (var i = this.length, fn; i--;) (fn = this[i]) && fn(now);
};

Timer.extend({
	add: function(fn, fps){
		var list = (functions[fps] || (functions[fps] = []));
		list.push(fn);
		if (!timers[fps]) timers[fps] = setInterval(loop.bind(list), 1000 / fps);
		return true;
	},
	remove: function(fn, fps){
		var list = functions[fps];
		if (list){
			list.erase(fn);
			if (!list.length && timers[fps]){
				delete functions[fps];
				timers[fps] = clearInterval(timers[fps]);
			}
		}
		return false;
	}
});

})();
