/**
 * @author: Chen yt7
 * @date: 2020/12/14 10:00 AM
 */
'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  // 所有用户信息
  async list() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.list(ctx.request.query.page);
  }
}
module.exports = UserController;
