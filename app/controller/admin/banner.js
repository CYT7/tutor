/**
 * @author: Chen yt7
 * @date: 2021/02/20 22:00 PM
 */
'use strict';
const fs = require('fs');
const pump = require('pump');
const Controller = require('egg').Controller;

class BannerController extends Controller {
  // 添加轮播图
  async createBanners() {
    const { ctx } = this;
    const parts = ctx.multipart({ autoFields: true });
    const params = parts.field;
    let stream;
    let dir = null;
    while ((stream = await parts()) != null) {
      if (!stream.filename) { break; }
      dir = await this.service.banner.saveCarousel(stream.filename);// 上传图片的目录
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);
    }
    const res = await ctx.service.banner.adminBannerAdd(params, dir.saveDir);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 删除轮播图
  async delBanners() {
    const { ctx, service } = this;
    const res = await service.banner.adminBannerDel(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 后台轮播图列表
  async listBanners() {
    const { ctx, service } = this;
    const res = await service.banner.adminBannerList();
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
    ctx.status = 201;
  }
}
module.exports = BannerController;
