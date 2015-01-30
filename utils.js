var _ = require('lodash');
var EE = require('events').EventEmitter;

exports.makeA = function(proto, opts) {
  var obj = Object.create(proto);
  opts = opts || {};
  _.extend(obj, opts);
  if (obj.init) { obj.init(opts); }
  return obj;
};

exports.makeEventable = function(obj) {
  _.extend(obj, EE.prototype);
  return obj;
};
