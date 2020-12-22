/**
 * @author: Chenyt
 * @date: 2020/12/22 1:30 PM
 */
'use strict';

const Controller = require('egg').Controller;

class AppointController extends Controller {
  // 查看所有预约
  async list() {
    const { ctx } = this;
    ctx.body = await ctx.service.appoint.adminList(ctx.request.query.page);
  }
}
module.exports = AppointController;
