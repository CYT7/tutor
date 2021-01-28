/**
 * @author: Chenyt
 * @date: 2020/12/11 3:30PM
 * @CompletionDate：2020/01/26 2:30PM
 */
'use strict';
const Controller = require('egg').Controller;
class CategoryController extends Controller {
  // 查看所有科目
  async listOfUser() {
    const { ctx } = this;
    const res = await ctx.service.category.listOfUser(ctx.request.query);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
    ctx.status = 201;
  }
}
module.exports = CategoryController;
