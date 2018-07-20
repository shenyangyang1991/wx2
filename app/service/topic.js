'use strict';

const Service = require('./base');

class TopicService extends Service {
  async getTopicByList(list) {
    const result  = [];

    for (let i = 0; i < list.length; i ++) {
      const topic = await this.getTopicById(list[i]);
      if (topic) {
        result.push(topic);
      }
    }
    return result;
  }

  async getTopicById(id) {
    const { ctx, key, util }  = this;

    if (!id) return;

    const pipeline            = ctx.subject().pipeline();
    const user_id             = this.user.id;

    pipeline.hget(key.topic, id); // 话题
    pipeline.scard(key.topic_like(id)); // 点赞数
    pipeline.llen(key.topic_comments(id)); // 评论数
    pipeline.sismember(key.topic_like(id), user_id); // 是否喜欢
    pipeline.lrange(key.topic_comments(id), 0, 1); // 2

    const model               = await pipeline.exec();
    const topic_res           = util.model2arr(model);
    const comment_list        = [];

    if (topic_res[4] && topic_res[4].length > 0) {
      for (let i = 0; i < topic_res[4].length; i ++) {

        const comment         = await ctx.service.comment.getCommentById(topic_res[4][i]);

        comment_list.push(comment);
      }
    }

    if (topic_res[0]) {
      const topic             = JSON.parse(topic_res[0]);
      topic['like_cnt']       = topic_res[1];
      topic['comment_cnt']    = topic_res[2];
      topic['like']           = topic_res[3];
      topic['comment_list']   = comment_list;
      const user_json         = await ctx.service.user.getUserById(topic.user_id);

      if (user_json) {
        topic['user']         = JSON.parse(user_json);
      }
      return topic;
    }
  }

  async save(body) {
    const { subject_id, title, poster, voice }  = body;
    const { ctx, key, util }                    = this;
    const id                                    = await ctx.subject().id(key.topic_id);
    const user_id                               = this.user.id;
    const create_time                           = Date.now();
    const template                              = { id, title, poster, voice, user_id, create_time };
    const json                                  = JSON.stringify(template);
    const pipeline                              = ctx.subject().pipeline();

    pipeline.hmset(key.topic, id, json);
    pipeline.zadd(key.subject_hot, Date.now(), subject_id);
    pipeline.lpush(key.subject_topics(subject_id), id);
    pipeline.lpush(key.topic_users(user_id), id);
    pipeline.sadd(key.subject_users(subject_id), this.user.id)

    const model                                 = await pipeline.exec();
    const topic_res                             = util.model2arr(model);

    ctx.getLogger('topicLogger').info(`topic: {content: ${json}, status: {${key.topic}: ${topic_res[0]}, ${key.subject_hot}: ${topic_res[1]}, ${key.subject_topics(subject_id)}: ${topic_res[2]}, ${key.topic_users(user_id)}: ${topic_res[3]}, ${key.subject_users(subject_id)}: ${topic_res[4]}}}`);
    if (topic_res[0] !== 'OK' || typeof topic_res[1] !== 'number' || typeof topic_res[2] !== 'number' || typeof topic_res[3] !== 'number' || typeof topic_res[4] !== 'number') {
      ctx.getLogger('topicErrLogger').info(`createtopic: {content: ${json}, status: 'create topic error'}`);
      return false;
    }
    return template;
  }
}

module.exports = TopicService;
