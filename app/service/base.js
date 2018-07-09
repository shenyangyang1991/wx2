'use strict';

const Service = require('egg').Service;
const key = require('../redis');
const util = require('../util');

class BaseService extends Service {
  get user() {
    return this.ctx.session.user;
  }

  get key() {
    return key;
  }

  get util() {
    return util;
  }
}

module.exports = BaseService;
