/**
 * @author: Chen yt7
 * @date: 2020/12/12 2:30 PM
 */
'use strict';

const Service = require('egg').Service;
const md5 = require('js-md5');
const { ERROR, SUCCESS } = require('../utils/restful');

class AdminService extends Service {
  async create(params) {
    const { ctx } = this;
    try {
      const md5Passwd = md5(params.password);
      const check = await ctx.model.user.findOne({
        where: { username: params.username },
      });
      if (check) {
        ctx.status = 406;
        return Object.assign(ERROR, { msg: '用户名已经存在' });
      }
      const res = await ctx.model.user.create({
        username: params.name,
        password: md5Passwd,
        realname: params.realname,
      });
      ctx.status = 201;
      return Object.assign(SUCCESS, { data: res });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
}
module.exports = AdminService;
