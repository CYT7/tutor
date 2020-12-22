/**
 * @author: Chenyt
 * @date: 2020/12/22 1:30 PM
 */
'use strict';

const Controller = require('egg').Controller;

class AppointController extends Controller {
  // 查看某一预约
  async see(){
    const {ctx} = this;
    ctx.body = await ctx.service.appoint.see(ctx.request.body);
  }
  // 完成预约
  async finish(){
    const { ctx } = this;
    ctx.body = await ctx.service.appoint.finish(ctx.request.body);
  }
  // 关闭预约
  async close(){
    const { ctx } = this;
    ctx.body = await ctx.service.appoint.close(ctx.request.body);
  }
  // 查看所有预约
  async list() {
    const { ctx } = this;
    ctx.body = await ctx.service.appoint.list(ctx.request.query.page);
  }
}
module.exports = AppointController;
