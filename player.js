var utils = require('./utils');

var player = utils.makeEventable({

  get dir() {
    return this.col - this.prevCol;
  },

  get char() {
    return (
      this.dir === 0 ?
      this.stillChar :
      ((this.dir > 0) ? this.rightChar : this.leftChar)
    );
  },

  init: function(opts) {
    this.prevCol = this.col;
    return this;
  },

  move: function(col) {
    this.prevCol = this.col;
    this.col = col;
    return this;
  }

});

exports.createPlayer = function(opts) {
  return utils.makeA(player, opts);
};
