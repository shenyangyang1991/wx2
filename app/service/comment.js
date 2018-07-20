'use strict';

const Service = require('./base');

class CommentService extends Service {
  async getCommentById(id) {
    const { ctx, key }      = this;

    if (!id) return;

    const comment_json      = await ctx.subject().hget(key.comment, id);

    if (comment_json) {
      const comment         = JSON.parse(comment_json);
      const user_json       = await ctx.service.user.getUserById(comment.user_id);

      if (user_json) {
        comment['user']     = JSON.parse(user_json);
      }

      if (comment.reply_id) {
        const reply_json    = await ctx.service.user.getUserById(comment.reply_id);

        if (reply_json) {
          comment['reply']  = JSON.parse(reply_json);
        }
      }
      return comment;
    }
  }

  async comment(body) {
    const { title, topic_id, reply_id, user_id }  = body;
    const { ctx, key, util}                       = this;
    const id                                      = await ctx.subject().id(key.comment_id);
    const create_time                             = Date.now();
    const template                                = { id, title, reply_id, user_id, create_time };
    const json                                    = JSON.stringify(template);
    const model                                   = await ctx.subject().pipeline().hmset(key.comment, id, json).lpush(key.topic_comments(topic_id), id).exec();
    const comment_res                             = util.model2arr(model);

    ctx.getLogger('commentLogger').info(`comment: {content: ${json}, status: {${key.comment}: ${comment_res[0]}, ${key.topic_comments(topic_id)}: ${comment_res[1]}}}`);
    if (comment_res[0] !== 'OK' || comment_res[2] <= 0) {
      ctx.getLogger('commentErrLogger').info(`comment: {content: ${json}, status: 'create comment error'`);
      return false;
    }
    const comment                                 = await this.getCommentById(id);
    return comment;
  }
}

module.exports = CommentService;
