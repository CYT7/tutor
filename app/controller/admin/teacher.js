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
    const res = await ctx.service.teacher.agree(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 审核不通过
  async disagree() {
    const { ctx } = this;
    const res = await ctx.service.teacher.disagree(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 所有教师信息列表
  async list() {
    const { ctx } = this;
    const res = await ctx.service.teacher.list(ctx.request.query.page);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
}
module.exports = TeacherController;
