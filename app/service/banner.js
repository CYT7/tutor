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
  // 保存图片
  async saveCarousel(filename) {
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
  // 添加轮播图
  async adminBannerAdd(params, Carousel) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    if (!params.sequence) { return [ -2, '参数异常' ]; }
    const check = await ctx.model.Banner.findOne({ sequence: params.sequence }).ne('deleted', 0);
    if (check) {
      return [ 404601, `序号：${params.sequence} 已存在，请更换其他序号或者删除原有的` ];
    }
    const newBanner = new ctx.model.Banner({
      sequence: params.sequence,
      carousel: Carousel,
      createTime: Math.round(new Date() / 1000),
    });
    newBanner.save();
    return [ 0, '添加轮播图成功', results[1], results[2] ];
  }
  // 删除轮播图
  async adminBannerDel(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const check = await ctx.model.Banner.findOne({ sequence: params.sequence }).ne('deleted', 0);
    if (!check) { return [ 404601, '轮播图删除失败' ]; }
    await this.ctx.model.Banner.updateOne({ sequence: params.sequence }, { deleted: 0 });
    return [ 0, `轮播图删除成功，执行人是${results[3]}`, results[1], results[2] ];
  }
  // 后台轮播图列表
  async adminBannerList() {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const reuslt = await ctx.model.Banner.find({}).ne('deleted', 0).sort({ sequence: 1 });
    if (!reuslt) { return [ 404603, '暂无轮播图' ]; }
    return [ 0, '所有轮播图返回成功', reuslt, results[1], results[2] ];
  }
  // 前台轮播图列表
  async BannerList() {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const reuslt = await ctx.model.Banner.find({}).ne('deleted', 0).sort({ sequence: 1 });
    if (!reuslt) { return [ 400801, '暂无轮播图' ]; }
    return [ 0, '所有轮播图返回成功', reuslt, results[1], results[2] ];
  }
}
module.exports = BannerService;
