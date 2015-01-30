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

exports.areColliding = function(entity1, entity2) {
  return (
    (entity1.row === entity2.row) &&
    (entity1.col === entity2.col)
  );
};
