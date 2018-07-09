'use strict';

const Controller = require('./base');

class UserController extends Controller {
  // 我的信息
  async index() {
    this.success(this.user);
  }
  // 我的动态
  async topic() {
    const { ctx, key, util } = this;
    // 接收 page
    const rule = { page: 'str2int' };
    ctx.validate(rule, ctx.query);
    const { page } = ctx.query;

    // topics list total
    const model = await ctx.subject().pipeline().llen(key.topic_users(this.user.id)).lrange(key.topic_users(this.user.id), 10 * page, 10 * page + 9).exec();
    const users_res = util.model2arr(model);
    const total = users_res[0];
    const topic_id = users_res[1];
    const result = { list: [], total: 0 };
    if (total) {
      result.total = total;
      for (let i = 0; i < topic_id.length; i ++) {
        const topic = await ctx.service.topic.getTopicById(topic_id[i]);
        result.list.push(topic);
      }
    }
    this.success(result);
  }
}

module.exports = UserController;
