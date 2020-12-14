/**
 * @author: Chen yt7
 * @date: 2020/12/14 10:15 AM
 */
'use strict';

const Service = require('egg').Service;
const md5 = require('js-md5');
const { ERROR, SUCCESS } = require('../utils/restful');

class UserService extends Service {
  // 创建用户
  async create(params) {
    const { ctx } = this;
    try {
      const checkUser = await ctx.model.User.findOne({ $or: [{ phone: params.phone }, { email: params.email }] });
      if (checkUser) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '系统已拥有这账号，请前往登录' });
      }
      const user = await ctx.model.User.aggregate().sort({ id: -1 });
      const newUser = new ctx.model.User({
        createTime: Math.round(new Date() / 1000),
        phone: params.phone,
        email: params.email,
        password: md5(params.password),
      });
      if (!user.length) {
        newUser.id = new Date().getFullYear().toString()
          .substr(2, 2) + '01';
      }
      if (!params.nickName) {
        newUser.nickName = '用户' + Math.random().toString(36).substr(0, 7);
        newUser.save();
      }
      newUser.nickName = params.nickName;
      newUser.save();
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '用户创建成功，你可以进行登录了', data: newUser });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }

}
module.exports = UserService;
