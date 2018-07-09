'use strict';

const Controller = require('./base');

class CommentController extends Controller {
  async index() {
    const { ctx, key } = this;
    const rule = {
      topic_id: 'str2int',
      page: 'str2int',
    };
    ctx.validate(rule, ctx.query);
    const { topic_id,  page } = ctx.query;
    const comment_list = await ctx.subject().lrange(key.topic_comments(topic_id), page * 10, page * 10 + 9);
    const result = [];
    for (let i = 0; i < comment_list.length; i ++) {
      const comment = await ctx.service.comment.getCommentById(comment_list[i]);
      result.push(comment);
    }
    this.success({ list: result });
  }

  async comment() {
    const { ctx, key } = this;
    const rule = {
      topic_id: 'string',
      title: 'string',
      subject_id: 'string',
    };
    ctx.validate(rule);
    const { subject_id, topic_id, title, reply_id } = ctx.request.body;
    const topic = await ctx.subject().hget(key.topic, topic_id);
    if (topic) {
      const comment = await ctx.service.comment.comment({ subject_id, topic_id, title, reply_id, user_id: this.user.id });
      if (comment) {
        this.success(comment);
      } else {
        this.fail('评论失败');
      }
    } else {
      this.fail('帖子不存在');
    }
  }
}

module.exports = CommentController;
