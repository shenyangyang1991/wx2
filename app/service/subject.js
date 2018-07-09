'use strict';

const Service = require('./base');

class SubjectService extends Service {
  async getSubjectById(id) {
    const { ctx, key, util } = this;
    if (!id) return;
    // 缺少hfc
    const pipeline = ctx.subject().pipeline();
    pipeline.hget(key.subject, id); // 话题
    pipeline.scard(key.subject_users(id)); // 人数
    pipeline.llen(key.subject_topics(id)); // 帖子
    pipeline.sismember(key.subject_follower(id), this.user.id); // 是否关注
    pipeline.lrange(key.subject_topics(id), 0, 2); // 3
    const model = await pipeline.exec();
    const subject_res = util.model2arr(model);
    let topic_list = [];
    if (subject_res[4] && subject_res[4].length > 0) {
      const topicpipeline = ctx.subject().pipeline();
      subject_res[4].forEach(topic => {
        topicpipeline.hget(key.topic, topic);
      });
      const model1 = await topicpipeline.exec();
      topic_list = util.model2arr(model1);
    }
    if (subject_res[0]) {
      const subject = JSON.parse(subject_res[0]);
      subject['people_cnt'] = subject_res[1];
      subject['topic_cnt'] = subject_res[2];
      subject['following'] = subject_res[3];
      subject['topic_list'] = util.str2obj(topic_list);
      return subject;
    }
  }
}

module.exports = SubjectService;
