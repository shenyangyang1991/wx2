'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 话题热点
  router.get('/v1/subject/hot', controller.subject.index);
  // 话题关注
  router.get('/v1/subject/follow', controller.subject.follow);
  // 创建话题
  router.post('/v1/subject', controller.subject.create);
  // 用户关注
  router.post('/v1/subject/follower', controller.subject.follower);
  // 帖子
  router.get('/v1/topic', controller.topic.index);
  // 用户发帖
  router.post('/v1/topic', controller.topic.create);
  // 用户点赞
  router.post('/v1/topic/like', controller.topic.like);
  // 评论
  router.get('/v1/comment', controller.comment.index);
  // 用户评论
  router.post('/v1/comment', controller.comment.comment);
  // 登录
  router.post('/v1/session', controller.session.login);
  // 我的动态
  router.get('/v1/user/topic', controller.user.topic);
  // 我的信息
  router.get('/v1/user', controller.user.index);
};
