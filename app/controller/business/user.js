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
  // 用户登录
  async login() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.login(ctx.request.body);
  }
  // 用户个人信息
  async information() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.information(ctx.request.body);
  }
  // 修改用户个人信息
  async modify() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.modify(ctx.request.body);
  }
}
module.exports = UserController;
