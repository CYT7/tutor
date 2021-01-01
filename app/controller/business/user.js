/**
 * @author: Chen yt7
 * @date: 2020/12/14 10:00 AM
 */
'use strict';
const fs = require('fs');
const pump = require('pump');

const Controller = require('egg').Controller;

class UserController extends Controller {
  // 创建用户
  async create() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.create(ctx.request.body);
  }
  // 用户登录
  async login() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.login(ctx.request.body);
  }
  // 用户个人信息
  async information() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.information(ctx.request.body);
  }
  // 修改用户个人信息
  async modify() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.modify(ctx.request.body);
  }
  // 保存头像
  async saveAvatar() {
    const { ctx } = this;
    const parts = ctx.multipart({ autoFields: true });
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      const fieldname = stream.fieldname; // file表单的名字
      // 上传图片的目录
      const dir = await this.service.user.saveAvatar(stream.filename);
      const target = dir.uploadDir;
      const file = dir.saveDir;
      await this.service.user.saveAvatar(file);
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);
      files = Object.assign(files, {
        [fieldname]: dir.saveDir,
      });
    }
    if (Object.keys(files).length > 0) {
      ctx.body = {
        code: 200,
        message: '用户上传头像成功',
        data: files,
      };
    } else {
      ctx.body = {
        code: 500,
        message: '用户上传头像失败',
        data: {},
      };
    }
  }
}
module.exports = UserController;
