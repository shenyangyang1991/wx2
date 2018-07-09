'use strict';

const Controller = require('./base');

class SubjectController extends Controller {
  async index() {
    const { ctx, key } = this;
    const rule = {
      page: 'str2int',
      next: 'str2int',
    };
    ctx.validate(rule, ctx.query);
    const { page, next } = ctx.query;
    const hot_list = await ctx.subject().zrevrangebyscore(key.subject_hot, next, 0, 'withscores', 'limit', page, 10);
    const result = [];
    for (let i = 0; i < hot_list.length; i += 2) {
      const subject = await ctx.service.subject.getSubjectById(hot_list[i]);
      if (subject) {
        subject.next = hot_list[i + 1];
        result.push(subject);
      }
    }
    this.success({ list: result });
  }

  async follow() {
    const { ctx, key } = this;
    const rule = {
      page: 'str2int',
      next: 'str2int',
    };
    ctx.validate(rule, ctx.query);
    const { page, next } = ctx.query;
    const subject_list = await ctx.subject().zrevrangebyscore(key.subject_follow(this.user.id), next, 0, 'withscores', 'limit', page, 10);
    const result = [];
    for (let i = 0; i < subject_list.length; i += 2) {
      const subject = await ctx.service.subject.getSubjectById(subject_list[i]);
      if (subject) {
        subject.next = subject_list[i + 1];
        result.push(subject);
      }
    }
    this.success({ list: result });
  }

  async create() {
    const { ctx, key, util } = this;
    const rule = {
      title: 'string',
      poster: 'string',
    };
    ctx.validate(rule);
    const { title, poster } = ctx.request.body;
    // id
    const id = await ctx.subject().id(key.subject_id);
    const template = { id, title, poster };
    const model = await ctx.subject().pipeline().hmset(key.subject, id, JSON.stringify(template)).zadd(key.subject_hot, Date.now(), id).exec();
    const subject_res = util.model2arr(model);
    if (subject_res[0] === 'OK' && typeof subject_res[1] === 'number') {
      this.success(template);
    } else {
      this.fail('创建话题失败');
    }
  }

  async follower() {
    const { ctx, key, util } = this;
    const rule = {
      subject_id: 'str2int',
      following: 'str2int',
    };
    ctx.validate(rule);
    const { subject_id, following } = ctx.request.body;
    // 是否存在话题
    const is = await ctx.subject().hexists(key.subject, subject_id);
    if (is) {
      if (following === '1') {
        // 关注
        await ctx.subject().pipeline().zadd(key.subject_follow(this.user.id), Date.now(), subject_id).sadd(key.subject_follower(subject_id), this.user.id).exec();
      } else if (following === '0') {
        await ctx.subject().pipeline().zrem(key.subject_follow(this.user.id), subject_id).srem(key.subject_follower(subject_id), this.user.id).exec();
      }
      this.success(following);
    } else {
      this.fail('话题不存在');
    }
  }
}

module.exports = SubjectController;
