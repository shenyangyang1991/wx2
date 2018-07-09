'use strict';

module.exports = app => {
  // rule
  app.validator.addRule('str2int', (rule, value) => {
    if (isNaN(parseInt(value))) {
      return 'str must be number';
    }
  });
  // redis
  // id counter
  ['subject', 'user'].forEach(name => {
    app.redis.get(name).defineCommand('id', {
      numberOfKeys: 1,
      lua: 'local id = redis.call(\'incr\', KEYS[1]);\n return id;',
    });
  });
};
