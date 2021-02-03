/**
 * @author: Chen yt7
 * @date: 2020/12/15 1:25 PM
 * @CompletionDate：2020/01/26 4:00PM
 */
'use strict';
const fs = require('fs');
const pump = require('pump');
const Controller = require('egg').Controller;
class TeacherController extends Controller {
  // 创建teacher
  async create() {
    const { ctx } = this;
    const res = await ctx.service.teacher.create(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 查看教师个人信息
  async information() {
    const { ctx } = this;
    const res = await ctx.service.teacher.information(ctx.request.body);
    ctx.status = 201;
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 修改教师个人信息
  async modify() {
    const { ctx } = this;
    const res = await ctx.service.teacher.modify(ctx.request.body);
    ctx.status = 201;
    if (res) {
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 用户查看教师个人信息
  async informationofUser() {
    const { ctx } = this;
    const res = await ctx.service.teacher.informationOfUser(ctx.request.body);
    ctx.status = 201;
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 所有教师信息列表
  async list() {
    const { ctx } = this;
    const res = await ctx.service.teacher.ListOfUser(ctx.request.query.page);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 搜索所有教师信息列表
  async search() {
    const { ctx } = this;
    const page = ctx.request.query.page || 1;
    let params = ctx.request.body;
    const res = await ctx.service.teacher.search(params, page);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 首页教师信息列表
  async listOfRecommend() {
    const { ctx } = this;
    const res = await ctx.service.teacher.listOfRecommend(ctx.request.query);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 身份证正面照
  async identityCard1() {
    const { ctx } = this;
    const parts = ctx.multipart({ autoFields: true });
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) { break; }
      const fieldname = stream.fieldname; // file表单的名字
      const dir = await this.service.teacher.identityCard1(stream.filename);// 上传图片的目录
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);
      files = Object.assign(files, { [fieldname]: dir.saveDir });
    }
    if (Object.keys(files).length > 0) {
      ctx.body = { code: 0, msg: '用户上传身份证成功', data: files };
    } else {
      ctx.body = { code: 400404, msg: '用户上传身份证失败', data: {} };
    }
  }
  // 身份证反面照
  async identityCard2() {
    const { ctx } = this;
    const parts = ctx.multipart({ autoFields: true });
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) { break; }
      const fieldname = stream.fieldname; // file表单的名字
      const dir = await this.service.teacher.identityCard2(stream.filename);// 上传图片的目录
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);
      files = Object.assign(files, { [fieldname]: dir.saveDir });
    }
    if (Object.keys(files).length > 0) {
      ctx.body = { code: 0, msg: '用户上传身份证成功', data: files };
    } else {
      ctx.body = { code: 400404, msg: '用户上传身份证失败', data: {} };
    }
  }
}
module.exports = TeacherController;
