/**
 * @author: Chen yt7
 * @date: 2020/12/14 10:15 AM
 * @modifyDate：2021/02/06 11：00AM
 */
'use strict';

const Service = require('egg').Service;
const jwt = require('../utils/jwt');
const path = require('path');
const sd = require('silly-datetime');
const mkdirp = require('mkdirp');

class BannerService extends Service {
  // 上传头像
  async adminBannerAdd(filename) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const day = sd.format(new Date(), 'YYYYMMDD');// 获取当前日期
    const dir = path.join(this.config.uploadDir, day);// 创建图片保存的路径
    await mkdirp(dir);// 不存在就创建目录
    const date = Date.now();// 毫秒数
    const uploadDir = path.join(dir, date + path.extname(filename));
    const saveDir = this.ctx.origin + uploadDir.slice(3).replace(/\\/g, '/');
    return { uploadDir, saveDir };
  }
}
module.exports = BannerService;
