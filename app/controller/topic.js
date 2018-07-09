'use strict';

const Controller = require('./base');

class TopicController extends Controller {
  async index() {
    const { ctx, key } = this;
    const rule = {
      subject_id: 'str2int',
      page: 'str2int',
    };
    ctx.validate(rule, ctx.query);
    const { subject_id, page } = ctx.query;
    const topic_list = await ctx.subject().lrange(key.subject_topics(subject_id), page * 10, page * 10 + 9);
    const result = [];
    for (let i = 0; i < topic_list.length; i ++) {
      const topic = await ctx.service.topic.getTopicById(topic_list[i]);
      if (topic) {
        result.push(topic);
      }
    }
    this.success({ list: result });
  }

  async create() {
    const { ctx, key } = this;
    const rule = {
      subject_id: 'str2int',
    };
    ctx.validate(rule);
    const { subject_id, title, poster, voice } = ctx.request.body;
    const is = await ctx.subject().hget(key.subject, subject_id);
    if (is) {
      const topic = await ctx.service.topic.save({ subject_id, title, poster, voice });
      if (topic) {
        this.success(topic);
        return;
      }
    }
    this.fail('发帖失败');
  }

  async like() {
    const { ctx, key } = this;
    const rule = {
      topic_id: 'str2int',
      like: 'str2int',
      subject_id: 'str2int',
    };
    ctx.validate(rule);
    const { topic_id, like, subject_id } = ctx.request.body;
    const is = await ctx.subject().hget(key.topic, topic_id);
    if (is) {
      if (like === '1') {
        await ctx.subject().sadd(key.topic_like(topic_id), this.user.id);
      } else if (like === '0') {
        await ctx.subject().srem(key.topic_like(topic_id), this.user.id);
      }
      this.success(like);
    } else {
      this.fail('帖子不存在');
    }
  }
}

module.exports = TopicController;
