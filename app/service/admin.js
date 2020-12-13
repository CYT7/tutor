/**
 * @author: Chen yt7
 * @date: 2020/12/12 2:30 PM
 */
'use strict';

const Service = require('egg').Service;
const md5 = require('js-md5');
const { ERROR, SUCCESS } = require('../utils/restful');

class AdminService extends Service {
  // 创建管理员
  async create(params) {
    const { ctx } = this;
    try {
      const check = await ctx.model.Admin.findOne({ name: params.name });
      if (check) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '用户名已经存在' });
      }
      const admin = await ctx.model.Admin.aggregate().sort({ id: -1 });
      const res = await ctx.model.Admin.create({
        id: admin[0].id + 1,
        name: params.name,
        password: md5(params.password),
        realname: params.realname,
        createTime: Math.round(new Date() / 1000),
      });
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '管理员创建成功', data: res });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 管理员登录
  async login(params) {
    const { ctx } = this;
    try {
      if (!params.name && !params.password) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: '参数异常' });
      }
      const checkAdmin = await ctx.model.Admin.findOne({ name: params.name, status: 1 });
      if (!checkAdmin) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: '管理员被禁用了，请联系超级管理员' });
      }
      const accountPwd = checkAdmin.password;
      const checkPwd = md5(params.password);
      if (accountPwd !== checkPwd) {
        return Object.assign(ERROR, { msg: '密码错误，请重新输入' });
      }
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '管理员登录成功' });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }

  }
}
module.exports = AdminService;
