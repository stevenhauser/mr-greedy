var utils = require('./utils');

var player = utils.makeEventable({

  get dir() {
    return this.loc - this.prevLoc;
  },

  get char() {
    return (
      this.dir === 0 ?
      this.stillChar :
      ((this.dir > 0) ? this.rightChar : this.leftChar)
    );
  },

  init: function(opts) {
    this.loc = 0;
    this.prevLoc = this.loc;
    return this;
  },

  move: function(loc) {
    this.prevLoc = this.loc;
    this.loc = loc;
    return this;
  }

});

exports.createPlayer = function(opts) {
  return utils.makeA(player, opts);
};
