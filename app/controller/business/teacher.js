/**
 * @author: Chen yt7
 * @date: 2020/12/15 1:25 PM
 * @CompletionDate：2020/01/26 4:00PM
 */
'use strict';
const Controller = require('egg').Controller;
class TeacherController extends Controller {
  // 创建teacher
  async create() {
    const { ctx } = this;
    const res = await ctx.service.teacher.create(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 查看教师个人信息
  async information() {
    const { ctx } = this;
    const res = await ctx.service.teacher.information(ctx.request.body);
    ctx.status = 201;
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 修改教师个人信息
  async modify() {
    const { ctx } = this;
    const res = await ctx.service.teacher.modify(ctx.request.body);
    ctx.status = 201;
    if (res) {
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 用户查看教师个人信息
  async informationofUser() {
    const { ctx } = this;
    const res = await ctx.service.teacher.informationOfUser(ctx.request.body);
    ctx.status = 201;
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 所有教师信息列表
  async list() {
    const { ctx } = this;
    const res = await ctx.service.teacher.ListOfUser(ctx.request.query.page);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 首页教师信息列表
  async listOfRecommend() {
    const { ctx } = this;
    const res = await ctx.service.teacher.listOfRecommend(ctx.request.query);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], total: res[3], token: res[4], exp: res[5] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }

}
module.exports = TeacherController;
