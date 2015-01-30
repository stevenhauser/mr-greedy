var _ = require('lodash');
var utils = require('./utils');

var NUM_STATES = 2;

var coin = utils.makeEventable({

  get timeAlive() {
    return Date.now() - this.startTime;
  },

  get row() {
    return Math.round(this.timeAlive / this.duration);
  },

  get points() {
    return this.value.points;
  },

  get char() {
    return this.value.char;
  },

  init: function() {
    this.reset();
    return this;
  },

  reset: function() {
    this.startTime = Date.now();
    this.col = _.random(0, this.maxCol);
    this.duration = _.random(this.minDur, this.maxDur);
    this.value = _.sample(this.values);
    return this;
  },

  shouldReset: function() {
    return this.timeAlive > this.duration;
  }

});

exports.createCoin = function(opts) {
  return utils.makeA(coin, opts);
};
