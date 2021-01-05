/**
 * @author: Chen yt7
 * @date: 2020/12/15 1:25 PM
 */
'use strict';

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
}
module.exports = TeacherController;
