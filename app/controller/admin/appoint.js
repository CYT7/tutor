/**
 * @author: Chenyt
 * @date: 2020/12/22 1:30 PM
 */
'use strict';

const Controller = require('egg').Controller;

class AppointController extends Controller {
  // 查看所有预约
  async list() {
    const { ctx } = this;
    const res = await ctx.service.appoint.adminList(ctx.request.query.page);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
}
module.exports = AppointController;
