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
    ctx.body = await ctx.service.user.list(ctx.request.query.page);
  }
  // 恢复用户状态
  async recovery() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.recovery(ctx.request.body);
  }
}
module.exports = UserController;
