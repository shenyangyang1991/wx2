'use strict';

const Service = require('./base');

class SubjectService extends Service {
  async getSubjectById(id) {
    const { ctx, key, util }  = this;
    const user_id             = this.user.id;

    if (!id) return;

    const pipeline            = ctx.subject().pipeline();

    pipeline.hget(key.subject, id); // 话题
    pipeline.scard(key.subject_users(id)); // 人数
    pipeline.llen(key.subject_topics(id)); // 帖子
    pipeline.sismember(key.subject_follower(id), user_id); // 是否关注
    pipeline.lrange(key.subject_topics(id), 0, 2); // 3

    const model               = await pipeline.exec();
    const subject_res         = util.model2arr(model);
    let topic_list            = [];

    if (subject_res[4] && subject_res[4].length > 0) {
      topic_list              = await ctx.service.topic.getTopicByList(subject_res[4])
    }
    if (subject_res[0]) {
      const subject           = JSON.parse(subject_res[0]);
      subject['people_cnt']   = subject_res[1];
      subject['topic_cnt']    = subject_res[2];
      subject['following']    = subject_res[3];
      subject['topic_list']   = topic_list;
      return subject;
    }
  }
}

module.exports = SubjectService;
