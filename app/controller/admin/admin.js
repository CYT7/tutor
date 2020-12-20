/**
 * @author: Chenyt
 * @date: 2020/12/11 11:00 AM
* @modifyDate：2020/12/17 8：40PM
 */
'use strict';

const Controller = require('egg').Controller;

class AdminController extends Controller {
  // 管理员创建
  async create() {
    const { ctx } = this;
    ctx.body = await ctx.service.admin.create(ctx.request.body);
  }
  // 删除管理员
  async delete() {
    const { ctx } = this;
    ctx.body = await ctx.service.admin.delete (ctx.request.body);
  }
  // 所有管理员的信息
  async list() {
    const { ctx } = this;
    ctx.body = await ctx.service.admin.list(ctx.request.query.page);
  }
  // 管理员登录
  async login() {
    const { ctx } = this;
    ctx.body = await ctx.service.admin.login(ctx.request.body);
  }
  // 管理员个人信息
  async information() {
    const { ctx } = this;
    ctx.body = await ctx.service.admin.information();
  }
  // 修改管理员个人信息
  async modify() {
    const { ctx } = this;
    ctx.body = await ctx.service.admin.modify(ctx.request.body);
  }
}

module.exports = AdminController;
