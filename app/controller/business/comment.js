/**
 * @author: Chenyt
 * @date: 2020/12/22 1:00 PM
 */
'use strict';

const Controller = require('egg').Controller;

class CommentController extends Controller {
  // 生成评论
  async generate() {
    const { ctx } = this;
    ctx.body = await ctx.service.comment.generate(ctx.request.body);
  }
  // 查看评论
  async see() {
    const { ctx } = this;
    ctx.body = await ctx.service.comment.see(ctx.request.body);
  }
  // 评论列表
  async list() {
    const { ctx } = this;
    ctx.body = await ctx.service.comment.list(ctx.request.query.page);
  }
}
module.exports = CommentController;
