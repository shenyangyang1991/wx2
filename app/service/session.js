'use strict';

const Service = require('./base');
const jscode2session = require('../http/jscode2session');

class SessionService extends Service {
  async login(body) {
    const { ctx, util, key } = this;
    const { code, nick_name, avatar_url } = body;

    if (!this.user) {
      const openid = await jscode2session(code, ctx);
      if (!openid) {
        return false;
      }
      const invitation_code = util.uuid8();
      const id = await ctx.user().id(key.user_id);
      const template = { id, nick_name, avatar_url, invitation_code, openid };
      const is = await ctx.user().hmset(key.user, id, JSON.stringify(template));
      if (is !== 'OK') {
        return false;
      }
      ctx.session.user = template;
    }

    return true;
  }
}

module.exports = SessionService;