'use strict';

const Controller = require('./base');

class UserController extends Controller {
  async index() {
    const { ctx, key }  = this;
    const user_id       = this.user.id;
    let user            = await ctx.service.user.getUserById(user_id);
    const day           = await ctx.user().llen(key.user_sign(user_id));

    if (user) {
      user              = JSON.parse(user)
      user.sign_day     = day;
    }
    this.success(user);
  }

  async topic() {
    const { ctx, key, util }  = this;
    const rule                = { page: 'str2int' };

    ctx.validate(rule, ctx.query);

    const { page }            = ctx.query;
    const user_id             = this.user.id;
    const model               = await ctx.subject().pipeline().llen(key.topic_users(user_id)).lrange(key.topic_users(user_id), 10 * page, 10 * page + 9).exec();
    const users_res           = util.model2arr(model);
    const total               = users_res[0];
    const topic_id            = users_res[1];
    const result              = { list: [], total: 0 };

    if (total) {
      result.total            = total;

      for (let i = 0; i < topic_id.length; i ++) {
        const topic           = await ctx.service.topic.getTopicById(topic_id[i]);

        if (topic) {
          result.list.push(topic);
        }
      }
    }
    this.success(result);
  }

  async sign() {
    const { ctx, key, util }  = this;
    // 接收 page
    const rule                = { timestamp: 'str2int' };

    ctx.validate(rule, ctx.query);

    const user_id             = this.user.id;
    const { timestamp }       = ctx.query;
    const server              = util.lasttime(new Date());
    const client              = util.lasttime(new Date(parseInt(timestamp)));

    if (client === server) {
      const time_list         = await ctx.user().lrange(key.user_sign(user_id), 0, 1);
      let   is_sign           = false;
      if (time_list && time_list.length > 0) {
        if (time_list[0] < client) {
          is_sign             = true;
        }
      } else {
        is_sign               = true;
      }
      if (is_sign) {
        await ctx.user().lpush(key.user_sign(user_id), server);
      }
    }
    this.success(server);
  }
}

module.exports = UserController;
