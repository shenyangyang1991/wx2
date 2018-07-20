'use strict';

const Controller = require('./base');

class CommentController extends Controller {
  async index() {
    const { ctx, key, util }  = this;
    const rule                = { topic_id: 'str2int', page: 'str2int' };

    ctx.validate(rule, ctx.query);

    const { topic_id,  page } = ctx.query;
    const model               = await ctx.subject().pipeline().lrange(key.topic_comments(topic_id), page * 10, page * 10 + 9).llen(key.topic_comments(topic_id)).exec();
    const comment_res         = util.model2arr(model);
    const comment_id          = comment_res[0];
    const comment_size        = comment_res[1];
    const result              = [];

    for (let i = 0; i < comment_id.length; i ++) {
      const comment           = await ctx.service.comment.getCommentById(comment_id[i]);
      if (comment) {
        result.push(comment);
      }
    }

    this.success({ list: result, total: comment_size });
  }

  async comment() {
    const { ctx, key }                  = this;
    const rule                          = { topic_id: 'string', title: 'string' };
    const user_id                       = this.user.id;

    ctx.validate(rule);

    const { topic_id, title, reply_id } = ctx.request.body;
    const topic                         = await ctx.subject().hget(key.topic, topic_id);

    if (topic) {
      const comment                     = await ctx.service.comment.comment({ topic_id, title, reply_id, user_id });
      if (comment) {
        this.success(comment);
      } else {
        this.fail('3001', '评论失败');
      }
    } else {
      this.fail('3002', '帖子不存在');
    }
  }
}

module.exports = CommentController;
