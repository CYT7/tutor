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
    ctx.body = await ctx.service.category.create(ctx.request.body);
  }
  // 修改科目类
  async modify() {
    const { ctx } = this;
    ctx.body = await ctx.service.category.modify(ctx.request.body);
  }
  // 删除科目类
  async del() {
    const { ctx } = this;
    ctx.body = await ctx.service.category.del(ctx.request.body);
  }
  // 查看所有科目
  async list() {
    const { ctx } = this;
    ctx.body = await ctx.service.category.list(ctx.request.query.page);
  }
}
module.exports = CategoryController;
