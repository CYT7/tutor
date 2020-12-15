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
}
module.exports = TeacherController;
