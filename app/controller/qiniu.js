'use strict';

const Controller = require('./base');
const qiniu      = require('qiniu');
const accessKey  = 'FVrhckCUol5scgxJ-TNI5pkrLRD6YE1d4YjUNxBw';
const secretKey  = 'lyCCPk005jFpsxAr1XMNFgih9gaoxFLHwFME-rCC';
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
