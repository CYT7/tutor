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
    ctx.body = await ctx.service.teacher.create(ctx.request.body);
  }
  // 查看教师个人信息
  async information() {
    const { ctx } = this;
    ctx.body = await ctx.service.teacher.information(ctx.request.body);
  }
  // 修改教师个人信息
  async modify() {
    const { ctx } = this;
    ctx.body = await ctx.service.teacher.modify(ctx.request.body);
  }
}
module.exports = TeacherController;
