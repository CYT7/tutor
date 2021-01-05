/**
 * @author: Chen yt7
 * @date: 2020/12/14 10:00 AM
 * @modifyDate：2020/12/17 8：45PM
 */
'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  // 所有用户信息
  async list() {
    const { ctx } = this;
    const res = await ctx.service.user.list(ctx.request.query.page);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
}
module.exports = UserController;
