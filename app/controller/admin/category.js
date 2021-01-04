/**
 * @author: Chenyt
 * @date: 2020/12/11 3:30PM
 */
'use strict';

const Controller = require('egg').Controller;

class CategoryController extends Controller {
  // 创建科目类
  async create() {
    const { ctx } = this;
    const res = await ctx.service.category.create(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
    ctx.status = 201;
  }
  // 修改科目类
  async modify() {
    const { ctx } = this;
    const res = await ctx.service.category.modify(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
    ctx.status = 201;
  }
  // 删除科目类
  async del() {
    const { ctx } = this;
    const res = await ctx.service.category.del(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
    ctx.status = 201;
  }
  // 查看所有科目
  async list() {
    const { ctx } = this;
    const res = await ctx.service.category.list(ctx.request.query.page);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
    ctx.status = 201;
  }
}
module.exports = CategoryController;
