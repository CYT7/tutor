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
    const res = await ctx.service.user.create(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 用户登录
  async login() {
    const { ctx } = this;
    const res = await ctx.service.user.login(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 用户个人信息
  async information() {
    const { ctx } = this;
    const res = await ctx.service.user.information(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 修改用户个人信息
  async modify() {
    const { ctx } = this;
    const res = await ctx.service.user.modify(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 保存头像
  async saveAvatar() {
    const { ctx } = this;
    const parts = ctx.multipart({ autoFields: true });
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) { break; }
      const fieldname = stream.fieldname; // file表单的名字
      const dir = await this.service.user.saveAvatar(stream.filename);// 上传图片的目录
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);
      files = Object.assign(files, { [fieldname]: dir.saveDir });
    }
    if (Object.keys(files).length > 0) {
      ctx.body = { code: 0, message: '用户上传头像成功', data: files };
    } else {
      ctx.body = { code: 400404, message: '用户上传头像失败', data: {} };
    }
  }
}
module.exports = UserController;
