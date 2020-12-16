/**
 * @author: Chen yt7
 * @date: 2020/12/15 10:00 AM
 */
'use strict';

const Controller = require('egg').Controller;

class TeacherController extends Controller {
  // 审核通过
  async agree() {
    const { ctx } = this;
    ctx.body = await ctx.service.teacher.agree(ctx.request.body);
  }
  // 审核不通过
  async disagree() {
    const { ctx } = this;
    ctx.body = await ctx.service.teacher.disagree(ctx.request.body);
  }
  // 所有教师信息列表
  async list() {
    const { ctx } = this;
    ctx.body = await ctx.service.teacher.list(ctx.request.query.page);
  }
}
module.exports = TeacherController;
