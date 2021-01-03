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
    const { ctx, service } = this;
    const res = await service.admin.create(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], token: res[2] };
    } else {
      ctx.body = { code: 404002, msg: res[1] };
    }
    ctx.status = 201;
  }
  // 管理员dashboard
  async index() {
    const { ctx, service } = this;
    const res = await service.admin.dashboard();
    if (res) {
      ctx.body = { code: res[0], msg: res[1], adminCount: res[2], userCount: res[3] };
    } else {
      ctx.body = { code: 404003, msg: res[1] };
    }
    ctx.status = 201;
  }
  // 删除管理员
  async delete() {
    const { ctx, service } = this;
    const res = await service.admin.delete(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1] };
    } else {
      ctx.body = { code: 404004, msg: res[1] };
    }
    ctx.status = 201;
  }
  // 所有管理员的信息
  async list() {
    const { ctx, service } = this;
    const res = await service.admin.list(ctx.request.query.page);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4] };
    } else {
      ctx.body = { code: 404005, msg: res[1] };
    }
    ctx.status = 201;
  }
  // 管理员登录
  async login() {
    const { ctx, service } = this;
    const res = await service.admin.login(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], token: res[2] };
    } else {
      ctx.body = { code: 404001, msg: res[1] };
    }
    ctx.status = 201;
  }
  // 管理员个人信息
  async information() {
    const { ctx, service } = this;
    const res = await service.admin.information();
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3] };
    } else {
      ctx.body = { code: 404006, msg: res[1] };
    }
    ctx.status = 201;
  }
  // 修改管理员个人信息
  async modify() {
    const { ctx, service } = this;
    const res = await service.admin.modify(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3] };
    } else {
      ctx.body = { code: 404007, msg: res[1] };
    }
    ctx.status = 201;
  }
}

module.exports = AdminController;
