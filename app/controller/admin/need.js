/**
 * @author: Chen yt7
 * @date: 2020/12/16 3:00 PM
 */
'use strict';
const Controller = require('egg').Controller;
class NeedController extends Controller {
  // 审核需求-通过
  async agree() {
    const { ctx } = this;
    ctx.body = await ctx.service.need.agree(ctx.request.body);
  }
  // 审核需求-不同意
  async disagree() {
    const { ctx } = this;
    ctx.body = await ctx.service.need.disagree(ctx.request.body);
  }
  // 所有需求信息
  async list() {
    const { ctx } = this;
    ctx.body = await ctx.service.need.adminList(ctx.request.query.page);
  }
}
module.exports = NeedController;
