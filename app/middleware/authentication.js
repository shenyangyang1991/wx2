'use strict';

module.exports = () => {
  return async function(ctx, next) {
    const user = ctx.session.user;

    if (user) {
      await next();
    } else {
      ctx.throw(403, '登录状态失效'); // 403 代表登录失效重新登录
    }
  };
};
