'use strict';

module.exports = {
  subject: 'subject:hash',
  subject_users(subject_id) {
    return `subject:users:${subject_id}:set`;
  },
  subject_topics(subject_id) {
    return `subject:topics:${subject_id}:list`;
  },
  subject_follow(user_id) {
    return `subject:follow:${user_id}:sorted`;
  },
  subject_hot: 'subject:hot:sorted',
  subject_id: 'subject:id',
  subject_hot_id: 'subject:hot:id',
  subject_follower(subject_id) {
    return `subject:follower:${subject_id}:set`;
  },
  topic: 'topic:hash',
  topic_like(topic_id) {
    return `topic:like:${topic_id}:set`;
  },
  topic_users(user_id) {
    return `topic:users:${user_id}:list`;
  },
  topic_comments(topic_id) {
    return `topic:comments:${topic_id}:list`;
  },
  topic_id: 'topic:id',
  comment: 'comment:hash',
  comment_id: 'comment:id',
  user_id: 'user:id',
  user: 'user',
};