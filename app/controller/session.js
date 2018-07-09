'use strict';

const Controller = require('./base');

class SessionController extends Controller {
  // 登录
  async login() {
    const { ctx } = this;
    const rule = {
      code: 'string',
      nick_name: 'string',
      avatar_url: 'string',
    };
    ctx.validate(rule);
    const { code, nick_name, avatar_url } = ctx.request.body;
    const is = await ctx.service.session.login({ code, nick_name, avatar_url });
    if (is) {
      this.success();
    } else {
      this.fail('登录失败');
    }
  }
}

module.exports = SessionController;
