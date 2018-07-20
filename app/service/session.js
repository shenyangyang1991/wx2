'use strict';

const Service         = require('./base');
const jscode2session  = require('../http/jscode2session');

class SessionService extends Service {
  async login(body) {
    const { ctx, util, key }              = this;
    const { code, avatar_url, nick_name } = body;

    if (!this.user) {
      const openid                        = await jscode2session(code, ctx);

      if (!openid) {
        const json                        = JSON.stringify(body);

        ctx.getLogger('sessionErrLogger').warn(`openid: {content: ${json}, status: 'curl error'}`)
        return false;
      }

      const user_id                       = await ctx.user().hget(key.user_openid, openid);
      let   sign_day                      = 0;
      let   template                      = {};
      if (!user_id) {
        const invitation_code             = util.uuid8();
        const id                          = await ctx.user().id(key.user_id);
        template                          = { id, nick_name, avatar_url, invitation_code, openid };
        const json                        = JSON.stringify(template)
        const model                       = await ctx.user().pipeline().hmset(key.user, id, json).hmset(key.user_openid, openid, id).exec();
        const session_res                 = util.model2arr(model)
        ctx.getLogger('sessionLogger').info(`user: {content: ${json}, status: {${key.user}: ${session_res[0]}, ${key.user_openid}: ${session_res[1]}}}`)
        if (session_res[0] !== 'OK' || session_res[1] !== 'OK') {
          ctx.getLogger('sessionErrLogger').warn(`createuser: {content: ${json}, status: 'create user error'}`)
          return false;
        }
      } else {
        const model                       = await ctx.user().pipeline().hget(key.user, user_id).llen(key.user_sign(user_id)).exec();
        const user_res                    = util.model2arr(model);

        if (user_res[0]) {
          template = JSON.parse(user_res[0]);
        }

        sign_day                          = user_res[1]
      }
      ctx.session.user                    = { ...template, sign_day };
    }
    return this.user;
  }
}

module.exports = SessionService;