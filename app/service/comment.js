/**
 * @author: Chen yt7
 * @date: 2020/12/22 1:10 PM
 */
'use strict';

const Service = require('egg').Service;
const md5 = require('js-md5');
const jwt = require('../utils/jwt');
const { ERROR, SUCCESS } = require('../utils/restful');

class CommentService extends Service{
  // 生成评论
  async generate(params) {
    const { ctx, app } = this;
    try {
      const results = jwt(app, ctx.request.header.authorization);
      if (results[0]) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '请求失败' });
      }
      const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
      if (!user) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '查无此账号' });
      }
    }catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 查看评论
  async see(params) {
    const { ctx, app } = this;
    try {

    }catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 评论列表
  async list(page) {
    const { ctx, app } = this;
    try {

    }catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
}
module.exports = CommentService;
