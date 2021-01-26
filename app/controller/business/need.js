/**
 * @author: Chen yt7
 * @date: 2020/12/16 2:35 PM
 * @CompletionDate：2020/01/26 3:45PM
 */
'use strict';
const Controller = require('egg').Controller;
class NeedController extends Controller {
  // 创建需求
  async create() {
    const { ctx } = this;
    const res = await ctx.service.need.create(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 申请需求(老师申请执教）
  async apply() {
    const { ctx } = this;
    const res = await ctx.service.need.apply(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 修改需求（审核不通过）
  async modify() {
    const { ctx } = this;
    const res = await ctx.service.need.modify(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 关闭需求
  async close() {
    const { ctx } = this;
    const res = await ctx.service.need.close(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 确定需求
  async confirm() {
    const { ctx } = this;
    const res = await ctx.service.need.confirm(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 需求完成
  async finish() {
    const { ctx } = this;
    const res = await ctx.service.need.finish(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 用户查看单一需求信息
  async information() {
    const { ctx } = this;
    const res = await ctx.service.need.information(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 主页查看推荐需求信息
  async list() {
    const { ctx } = this;
    const res = await ctx.service.need.list(ctx.request.query);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], total: res[3], token: res[4], exp: res[5] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 用户查看自已所有需求信息
  async Userlist() {
    const { ctx } = this;
    const res = await ctx.service.need.Userlist(ctx.request.query.page);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 老师查看自已所有需求信息
  async Teacherlist() {
    const { ctx } = this;
    const res = await ctx.service.need.Teacherlist(ctx.request.query.page);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 用户查看所有需求信息
  async List() {
    const { ctx } = this;
    const res = await ctx.service.need.List(ctx.request.query.page);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
}
module.exports = NeedController;
