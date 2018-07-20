'use strict';

const path = require('path');

module.exports = appInfo => {
  const config        = exports = {};
  config.keys         = appInfo.name + '_1531035786610_5782';
  config.middleware   = [ 'authentication', 'limit' ];
  config.security     = { csrf: { enable: false } };
  config.redis        = {
                          clients     : {
                            subject   : {
                              port    : 6379,
                              host    : 'r-bp10b787698e1954.redis.rds.aliyuncs.com',
                              password: 'Syy@19910408',
                              db      : 0,
                            },
                            user      : {
                              port    : 6379,
                              host    : 'r-bp150450d30a2b94.redis.rds.aliyuncs.com',
                              password: 'Syy@19910408',
                              db      : 0,
                            },
                            session   : {
                              port    : 6379,
                              host    : 'r-bp150450d30a2b94.redis.rds.aliyuncs.com',
                              password: 'Syy@19910408',
                              db      : 1,
                            },
                          },
                        };

  config.sessionRedis = {
    name    : 'session',
    key     : 'HFC_SESS',
    maxAge  : 1800000,
    httpOnly: false,
    encrypt : true,
    renew   : true,
  };
  config.weapp = {
    appId       : 'wxf4ae9ddb9ec77f2e',
    appSecret   : 'dacb0d4c7f111f4e7428d4ea03ae21b0',
  };
  config.qiniu = {
    accessKey   : 'FVrhckCUol5scgxJ-TNI5pkrLRD6YE1d4YjUNxBw',
    secretKey   : 'lyCCPk005jFpsxAr1XMNFgih9gaoxFLHwFME-rCC',
  };
  config.customLogger = {
    commentLogger: {
      file: path.join(appInfo.root, 'logs/comment.log'),
    },
    commentErrLogger: {
      file: path.join(appInfo.root, 'logs/comment-err.log'),
    },
    sessionLogger: {
      file: path.join(appInfo.root, 'logs/session.log'),
    },
    sessionErrLogger: {
      file: path.join(appInfo.root, 'logs/session-err.log'),
    },
    subjectLogger: {
      file: path.join(appInfo.root, 'logs/subject.log'),
    },
    subjectErrLogger: {
      file: path.join(appInfo.root, 'logs/subject-err.log'),
    },
    topicLogger: {
      file: path.join(appInfo.root, 'logs/topic.log'),
    },
    topicErrLogger: {
      file: path.join(appInfo.root, 'logs/topic-err.log'),
    }
  };
  config.limit = {
    duration      : 60000,
    errorMessage  : { errMsg: '放松双眼，休息片刻' },
    headers       : {
                      remaining: 'Hfc-Limit-Remaining',
                      reset: 'Hfc-Limit-Reset',
                      total: 'Hfc-Limit-Total',
                    },
    max           : 100,
    disableHeader : false,
    ignore        : '/v1/session',
    name          : 'session'
  };
  config.authentication = {
    ignore: '/v1/session',
  };
  config.onerror = {
    accepts(ctx) {
      if (ctx.app.config.env === 'prod') return 'json';
      return 'html';
    },
    json(err, ctx) {
      let errJson   = {};
      const status  = err.status || 500;
      const errMsg  = status === 500 ? '网络服务器错误' : err.message;
      errJson       = { code: status, message: errMsg };
      ctx.body      = errJson;
      ctx.status    = status;
    },
  };
  return config;
};
