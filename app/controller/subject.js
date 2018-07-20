'use strict';

const Controller = require('./base');

class SubjectController extends Controller {
  async index() {
    const { ctx, key }      = this;
    const rule              = { page: 'str2int', next: 'str2int' };

    ctx.validate(rule, ctx.query);

    const { page, next }    = ctx.query;
    const hot_list          = await ctx.subject().zrevrangebyscore(key.subject_hot, next, 0, 'withscores', 'limit', page, 10);
    const result            = [];

    for (let i = 0; i < hot_list.length; i += 2) {
      const subject         = await ctx.service.subject.getSubjectById(hot_list[i]);

      if (subject) {
        subject.next        = hot_list[i + 1];

        result.push(subject);
      }
    }
    this.success({ list: result });
  }

  async subject() {
    const { ctx, key, util }  = this;
    const rule                = { subject_id: 'str2int' };

    ctx.validate(rule, ctx.query);

    const { subject_id }      = ctx.query;
    const user_id             = this.user.id;
    const pipeline            = ctx.subject().pipeline();

    pipeline.hget(key.subject, subject_id); // 话题
    pipeline.scard(key.subject_users(subject_id)); // 人数
    pipeline.llen(key.subject_topics(subject_id)); // 帖子
    pipeline.sismember(key.subject_follower(subject_id), user_id); // 是否关注

    const model               = await pipeline.exec();
    const subject_res         = util.model2arr(model);
    let   subject             = {}

    if (subject_res[0]) {
      subject                 = JSON.parse(subject_res[0]);
      subject['people_cnt']   = subject_res[1];
      subject['topic_cnt']    = subject_res[2];
      subject['following']    = subject_res[3];
    }
    this.success(subject);
  }

  async follow() {
    const { ctx, key }    = this;
    const rule            = { page: 'str2int', next: 'str2int' };

    ctx.validate(rule, ctx.query);

    const { page, next }  = ctx.query;
    const user_id         = this.user.id;
    const subject_list    = await ctx.subject().zrevrangebyscore(key.subject_follow(user_id), next, 0, 'withscores', 'limit', page, 10);
    const result          = [];

    for (let i = 0; i < subject_list.length; i += 2) {
      const subject       = await ctx.service.subject.getSubjectById(subject_list[i]);

      if (subject) {
        subject.next      = subject_list[i + 1];

        result.push(subject);
      }
    }
    this.success({ list: result });
  }

  async create() {
    const { ctx, key, util }        = this;
    const rule                      = { title: 'string', poster: 'string', share: 'string' };

    ctx.validate(rule);

    const { title, poster, share }  = ctx.request.body;
    const id                        = await ctx.subject().id(key.subject_id);
    const template                  = { id, title, poster, share };
    const json                      = JSON.stringify(template)
    const model                     = await ctx.subject().pipeline().hmset(key.subject, id, json).zadd(key.subject_hot, Date.now(), id).exec();
    const subject_res               = util.model2arr(model);

    ctx.getLogger('subjectLogger').info(`subject: {content: ${json}, status: {${key.subject}: ${subject_res[0]}, ${key.subject_hot}: ${subject_res[1]}}}`);
    if (subject_res[0] === 'OK' && typeof subject_res[1] === 'number') {
      this.success(template);
    } else {
      ctx.getLogger('subjectErrLogger').warn(`createsubject: {content: ${json}, status: 'create subject error'}`);
      this.fail('2001', '创建话题失败');
    }
  }

  async follower() {
    const { ctx, key, util }        = this;
    const rule                      = { subject_id: 'str2int', following: 'str2int' };

    ctx.validate(rule);

    const { subject_id, following } = ctx.request.body;
    const user_id                   = this.user.id;
    const is_subject                = await ctx.subject().hexists(key.subject, subject_id);

    if (is_subject) {
      if (following === '1') {
        await ctx.subject().pipeline().zadd(key.subject_follow(user_id), Date.now(), subject_id).sadd(key.subject_follower(subject_id), user_id).exec();
      } else if (following === '0') {
        await ctx.subject().pipeline().zrem(key.subject_follow(user_id), subject_id).srem(key.subject_follower(subject_id), user_id).exec();
      }
      this.success(following);
    } else {
      this.fail('2002', '话题不存在');
    }
  }
}

module.exports = SubjectController;
