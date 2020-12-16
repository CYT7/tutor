/**
 * @author: Chen yt7
 * @date: 2020/12/16 2:35 PM
 */
'use strict';
const Controller = require('egg').Controller;
class NeedController extends Controller {
  async create() {
    const { ctx } = this;
    ctx.body = await ctx.service.need.create(ctx.request.body);
  }
}
module.exports = NeedController;
