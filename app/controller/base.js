'use strict';

const Controller = require('egg').Controller;
const key = require('../redis');
const util = require('../util');

class BaseController extends Controller {
  get user() {
    return this.ctx.session.user;
  }

  get key() {
    return key;
  }

  get util() {
    return util;
  }

  success(data) {
    this.ctx.status = 200;
    this.ctx.body = {
      code: 200,
      data,
      message: 'success',
    };
  }

  fail(message) {
    this.ctx.status = 200;
    this.ctx.body = {
      code: 500,
      message,
    };
  }
}

module.exports = BaseController;
