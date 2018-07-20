'use strict';

module.exports = {
  subject_id      : 'subject:id:string',
  subject         : 'subject:hash',
  subject_hot     : 'subject:hot:sorted',
  subject_follow  : (user_id) => {
    return `subject:follow:${user_id}:sorted`;
  },
  subject_topics  : (subject_id) => {
    return `subject:topics:${subject_id}:list`;
  },
  subject_users   : (subject_id) => {
    return `subject:users:${subject_id}:set`;
  },
  subject_follower: (subject_id) => {
    return `subject:follower:${subject_id}:set`;
  },
  topic_id        : 'topic:id:string',
  topic           : 'topic:hash',
  topic_comments  : (topic_id) => {
    return `topic:comments:${topic_id}:list`;
  },
  topic_users     : (user_id) => {
    return `topic:users:${user_id}:list`;
  },
  topic_like      : (topic_id) => {
    return `topic:like:${topic_id}:set`;
  },
  comment_id      : 'comment:id:string',
  comment         : 'comment:hash',
  user_id         : 'user:id:string',
  user            : 'user:hash',
  user_sign       : (user_id) => {
    return `user:sign:${user_id}:list`;
  },
  user_openid     : 'user:openid:hash',
};