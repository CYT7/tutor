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
    const res = await ctx.service.need.agree(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 审核需求-不同意
  async disagree() {
    const { ctx } = this;
    const res = await ctx.service.need.disagree(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 所有需求信息
  async list() {
    const { ctx } = this;
    const page = ctx.request.query.page || 1;
    let types = ctx.request.query.types;
    if (types) { types = types.split(','); }
    const res = await ctx.service.need.adminList(page, types);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
}
module.exports = NeedController;
