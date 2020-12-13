/**
 * @author: Chenyt
 * @date: 2020/12/11 11:00 AM
 */
'use strict';

const Controller = require('egg').Controller;

class AdminController extends Controller {
  // 管理员创建
  async create() {
    const { ctx } = this;
    ctx.body = await ctx.service.admin.create(ctx.request.body);
  }
  // 管理员登录
  async login() {
    const { ctx } = this;
    ctx.body = await ctx.service.admin.login(ctx.request.body);
  }
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
    ctx.status = 201;
  }
}

module.exports = AdminController;
