/**
 * @author: Chenyt
 * @date: 2020/12/22 1:30 PM
* @CompletionDate：2020/01/26 4:10PM
 */
'use strict';
const Controller = require('egg').Controller;
class AppointController extends Controller {
  // 生成预约
  async create() {
    const { ctx } = this;
    const res = await ctx.service.appoint.create(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 同意预约
  async agree() {
    const { ctx } = this;
    const res = await ctx.service.appoint.agree(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 不同意预约
  async disagree() {
    const { ctx } = this;
    const res = await ctx.service.appoint.disagree(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 付款预约
  async pay() {
    const { ctx } = this;
    const res = await ctx.service.appoint.pay(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 老师查看某一预约
  async teacherSee() {
    const { ctx } = this;
    const res = await ctx.service.appoint.teacherSee(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 家长查看某一预约
  async userSee() {
    const { ctx } = this;
    const res = await ctx.service.appoint.userSee(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 完成预约
  async finish() {
    const { ctx } = this;
    const res = await ctx.service.appoint.finish(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token:res[2], exp:res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 关闭预约
  async close() {
    const { ctx } = this;
    const res = await ctx.service.appoint.close(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token:res[2], exp:res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 用户查看所有预约
  async userList() {
    const { ctx } = this;
    const res = await ctx.service.appoint.userList(ctx.request.query.page);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 老师查看所有预约
  async teacherList() {
    const { ctx } = this;
    const res = await ctx.service.appoint.teacherList(ctx.request.query);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
}
module.exports = AppointController;
