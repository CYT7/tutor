/**
 * @author: Chen yt7
 * @date: 2020/12/16 2:35 PM
 */
'use strict';
const Controller = require('egg').Controller;
class NeedController extends Controller {
  // 创建需求
  async create() {
    const { ctx } = this;
    ctx.body = await ctx.service.need.create(ctx.request.body);
  }
  // 申请需求(老师申请执教）
  async apply() {
    const { ctx } = this;
    ctx.body = await ctx.service.need.apply(ctx.request.body);
  }
  // 修改需求（审核不通过）
  async modify() {
    const { ctx } = this;
    ctx.body = await ctx.service.need.modify(ctx.request.body);
  }
  // 关闭需求
  async close() {
    const { ctx } = this;
    ctx.body = await ctx.service.need.close(ctx.request.body);
  }
  // 确定需求
  async confirm() {
    const { ctx } = this;
    ctx.body = await ctx.service.need.confirm(ctx.request.body);
  }
  // 需求完成
  async finish() {
    const { ctx } = this;
    ctx.body = await ctx.service.need.finish(ctx.request.body);
  }
  // 单一需求信息
  async information() {
    const { ctx } = this;
    ctx.body = await ctx.service.need.information(ctx.request.body);
  }
  // 所有需求信息
  async list() {
    const { ctx } = this;
    ctx.body = await ctx.service.need.list(ctx.request.query.page);
  }
}
module.exports = NeedController;
