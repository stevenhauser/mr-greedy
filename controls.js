var utils = require('./utils');

var controls = utils.makeEventable({

  init: function(opts) {
    this.cur  = this.min;
    this.listenForChanges();
    return this;
  },

  // The knob gives us the opposite of the values we want,
  // so subtract `max` from `knob.value` to get the value
  // we want. It'll be negative though, so we need to `abs`
  // it, and then `floor` to integer it.
  calcCurFromKnob: function() {
    var cur = this.cur;
    this.cur = Math.floor(Math.abs(this.knob.value - this.max));
    if (cur !== this.cur) {
      this.emit('changed', this.cur);
    }
    return this;
  },

  listenForChanges: function() {
    this.knob.scale(this.min, this.max)
      .on('data', this.calcCurFromKnob.bind(this));
    return this;
  }

});

exports.createControls = function(opts) {
  return utils.makeA(controls, opts);
};
