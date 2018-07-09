'use strict';

const Service = require('./base');

class TopicService extends Service {
  async getTopicById(id) {
    const { ctx, key, util } = this;
    if (!id) return;
    // 缺少hfc
    const pipeline = ctx.subject().pipeline();
    pipeline.hget(key.topic, id); // 话题
    pipeline.scard(key.topic_like(id)); // 点赞数
    pipeline.llen(key.topic_comments(id)); // 评论数
    pipeline.sismember(key.topic_like(id), this.user.id); // 是否喜欢
    pipeline.lrange(key.topic_comments(id), 0, 1); // 2
    const model = await pipeline.exec();
    const topic_res = util.model2arr(model);
    let comment_list = [];
    if (topic_res[4] && topic_res[4].length > 0) {
      const commentpipeline = ctx.subject().pipeline();
      topic_res[4].forEach(comment => {
        commentpipeline.hget(key.comment, comment);
      });
      const model1 = await commentpipeline.exec();
      comment_list = util.model2arr(model1);
    }
    if (topic_res[0]) {
      const topic = JSON.parse(topic_res[0]);
      topic['like_cnt'] = topic_res[1];
      topic['comment_cnt'] = topic_res[2];
      topic['like'] = topic_res[3];
      topic['comment_list'] = util.str2obj(comment_list);
      const userstr = await ctx.service.user.getUserById(topic.user_id);
      if (userstr) {
        topic['user'] = JSON.parse(userstr);
      }
      return topic;
    }
  }

  async save(body) {
    const { subject_id, title, poster, voice } = body;
    const { ctx, key, util } = this;

    const id = await ctx.subject().id(key.topic_id);
    const template = { id, title, poster, voice, user_id: this.user.id, create_time: Date.now() };
    const pipeline = ctx.subject().pipeline();
    pipeline.hmset(key.topic, id, JSON.stringify(template));
    pipeline.zadd(key.subject_hot, Date.now(), subject_id);
    pipeline.lpush(key.subject_topics(subject_id), id);
    pipeline.lpush(key.topic_users(this.user.id), id);
    pipeline.sadd(key.subject_users(subject_id), this.user.id)
    await pipeline.exec();
    return template;
  }
}

module.exports = TopicService;
