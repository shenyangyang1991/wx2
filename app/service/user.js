'use strict';

const Service = require('./base');

class UserService extends Service {
  async getUserById(id) {
    if (!id) return;

    const { ctx, key }  = this;
    const user          = await ctx.user().hget(key.user, id);

    if (user) {
      return user;
    }
  }
}

module.exports = UserService;
