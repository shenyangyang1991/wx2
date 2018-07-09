'use strict';

// had enabled by egg
// exports.static = true;
exports.redis = {
  enable: true,
  package: 'egg-redis',
};
exports.validate = {
  enable: true,
  package: 'egg-validate',
};
exports.sessionRedis = {
  enable: true,
  package: 'egg-session-redis',
};