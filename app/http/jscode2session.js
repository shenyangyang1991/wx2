'use strict';

const apiUrl = 'https://api.weixin.qq.com/sns/jscode2session';

module.exports = async (jscode, ctx) => {
  const weapp     = ctx.app.config.weapp;
  const params    = `?appid=${weapp.appId}&secret=${weapp.appSecret}&js_code=${jscode}&grant_type=authorization_code`;

  const response          = await ctx.curl(`${apiUrl}${params}`, { contentType: 'json', dataType: 'json' });
  const { status, data }  = response;
  if (status === 200 && data && data.openid) {
    return data.openid;
  }
  return '';
};
