/**
 * @author: Chenyt
 * @date: 2020/12/11 11:00 AM
* @modifyDate：2020/01/03 9：00PM
 */
'use strict';

const Controller = require('egg').Controller;

class AdminController extends Controller {
  // 管理员创建
  async create() {
    const { ctx } = this;
    const res = await ctx.service.admin.create(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
    ctx.status = 201;
  }
  // 删除管理员
  async delete() {
    const { ctx } = this;
    const res = await ctx.service.admin.delete(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
    ctx.status = 201;
  }
  // 所有管理员的信息
  async list() {
    const { ctx } = this;
    const res = await ctx.service.admin.list(ctx.request.query.page);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
    ctx.status = 201;
  }
  // 管理员登录
  async login() {
    const { ctx } = this;
    const res = await ctx.service.admin.login(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
    ctx.status = 201;
  }
  // 管理员dashboard
  async index() {
    const { ctx } = this;
    const res = await ctx.service.admin.dashboard();
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
    ctx.status = 201;
  }
  // 管理员个人信息
  async information() {
    const { ctx } = this;
    const res = await ctx.service.admin.information();
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
    ctx.status = 201;
  }
  // 修改管理员个人信息
  async modify() {
    const { ctx } = this;
    const res = await ctx.service.admin.modify(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
    ctx.status = 201;
  }
}

module.exports = AdminController;
