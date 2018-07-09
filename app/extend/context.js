'use strict';

module.exports = {
  subject() {
    return this.app.redis.get('subject');
  },
  user() {
    return this.app.redis.get('user');
  },
};
