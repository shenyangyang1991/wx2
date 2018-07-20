'use strict';

const Controller = require('./base');

class SessionController extends Controller {
  async login() {
    const { ctx }                         = this;
    const rule                            = { code: 'string', nick_name: 'string', avatar_url: 'string' };

    ctx.validate(rule);

    const { code, nick_name, avatar_url } = ctx.request.body;
    const user                            = await ctx.service.session.login({ code, nick_name, avatar_url });

    if (user) {
      this.success(user);
    } else {
      this.fail('1001', '登录失败');
    }
  }
}

module.exports = SessionController;
