/**
 * @author: Chen yt7
 * @date: 2020/12/14 10:00 AM
 */
'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  // 创建用户
  async create() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.create(ctx.request.body);
  }
}
module.exports = UserController;
