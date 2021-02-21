/**
 * @author: Chen yt7
 * @date: 2021/02/20 22:00 AM
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
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) { break; }
      const fieldname = stream.fieldname; // file表单的名字
      const dir = await this.service.banner.adminBannerAdd(stream.filename);// 上传图片的目录
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);
      files = Object.assign(files, { [fieldname]: dir.saveDir });
      if (!params.sequence) {
        ctx.body = { code: -2, msg: '参数异常' };
        return;
      }
      console.log('sequence' + params.sequence);
      const check = await ctx.model.Banner.findOne({ sequence: params.sequence });
      if (check) {
        ctx.body = { code: 404601, msg: `序号：${params.sequence} 已存在，请更换其他序号或者删除原有的` };
        return;
      }
      const newBanner = new ctx.model.Banner({
        sequence: params.sequence,
        carousel: dir.saveDir,
        createTime: Math.round(new Date() / 1000),
      });
      newBanner.save();
    }
    if (Object.keys(files).length > 0) {
      ctx.body = { code: 0, msg: '添加轮播图成功' };
    } else {
      ctx.body = { code: 404601, msg: '添加轮播图失败' };
    }
  }
}
module.exports = BannerController;
