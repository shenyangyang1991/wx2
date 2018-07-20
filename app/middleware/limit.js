'use strict';

const ratelimit = require('koa-ratelimit');

module.exports = (options, app) => {
  const name = app.config.limit.name;
  options.db = name ? app.redis.get(name) : app.redis;
  options.id = ctx => ctx.session.user.id;
  return ratelimit(options);
};
