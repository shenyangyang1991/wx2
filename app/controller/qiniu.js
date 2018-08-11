'use strict';

const Controller = require('./base');
const qiniu      = require('qiniu');
const accessKey  = '';
const secretKey  = '';
const mac        = new qiniu.auth.digest.Mac(accessKey, secretKey);
const bucket     = 'highfaner-hfc';

class QiniuController extends Controller {
  index() {
    const { ctx }   = this;
    const putPolicy = new qiniu.rs.PutPolicy({ scope: bucket });
    const token     = putPolicy.uploadToken(mac);
    ctx.status      = 200;
    ctx.body        = { uptoken: token };
  }
}

module.exports = QiniuController;
