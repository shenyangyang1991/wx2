'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1531035786610_5782';

  // add your config here
  config.middleware = [];
  config.security = {
    csrf: {
      enable: false,
    },
  };
  config.redis = {
    clients: {
      subject: {
        port: 6379,
        host: '127.0.0.1',
        password: '',
        db: 0,
      },
      user: {
        port: 6379,
        host: '127.0.0.1',
        password: '',
        db: 2,
      },
      session: {
        port: 6379,
        host: '127.0.0.1',
        password: '',
        db: 1,
      },
    },
  };

    // session 15m 900000
    config.sessionRedis = {
      name: 'session',
      key: '__hfc__sess__',
      maxAge: 900000000,
      httpOnly: false,
      encrypt: true,
      renew: true,
    };
    // weapp
    config.weapp = {
      appId: 'wxf4ae9ddb9ec77f2e',
      appSecret: 'dacb0d4c7f111f4e7428d4ea03ae21b0',
    };

  return config;
};
