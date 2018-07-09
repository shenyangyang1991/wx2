'use strict';

const Service = require('./base');

class CommentService extends Service {
  async getCommentById(id) {
    const { ctx, key } = this;
    if (!id) return;
    const commentstr = await ctx.subject().hget(key.comment, id);
    if (commentstr) {
      const comment = JSON.parse(commentstr);
      const userstr = await ctx.service.user.getUserById(comment.user_id);
      if (userstr) {
        comment['user'] = JSON.parse(userstr);
      }
      if (comment.reply_id) {
        const replystr = await ctx.service.user.getUserById(comment.reply_id);
        if (replystr) {
          comment['reply'] = JSOn.parse(replystr);
        }
      }
      return comment;
    }
  }

  async comment(body) {
    const { title, topic_id, subject_id, reply_id, user_id } = body;
    const { ctx, key } = this;
    const id = await ctx.subject().id(key.comment_id);
    const template = { id, title, reply_id, user_id, create_time: Date.now() };
    await ctx.subject().pipeline().hmset(key.comment, id, JSON.stringify(template)).lpush(key.topic_comments(topic_id), id).exec();
    return template;
  }
}

module.exports = CommentService;
