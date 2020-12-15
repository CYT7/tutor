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
      newUser.nickName = params.nickName;
      if (!params.nickName) {
        const round = Math.random().toString(36).substr(3, 5) + Date.now().toString(36);
        newUser.nickName = '用户' + round;
      }
      if (!user.length) {
        newUser.id = new Date().getFullYear().toString()
          .substr(0, 4) + '1';
        newUser.save();
        ctx.status = 201;
        return Object.assign(SUCCESS, { msg: '用户创建成功，你可以进行登录了', data: newUser });
      }
      newUser.id = user[0].id + 1;
      newUser.save();
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '用户创建成功，你可以进行登录了', data: newUser });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 用户登录
  async login(params) {
    const { ctx } = this;
    try {
      const check = await ctx.model.User.findOne({ $or: [{ phone: params.phone }, { email: params.email }] }).ne('status', 0);
      if (!check) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '查无此账号，请前往创建或者联系管理员' });
      }
      const pwd = md5(params.password);
      if (pwd !== check.password) { return Object.assign(ERROR, { msg: '登录失败，密码错误' }); }
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `${check.nickName} 登录成功，欢迎回来` });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 用户个人信息
  async information(params) {
    const { ctx } = this;
    try {
      const check = await ctx.model.User.findOne({ $or: [{ phone: params.phone }, { email: params.email }] }, { _id: 0, password: 0 }).ne('status', 0);
      if (!check) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '查无此账号，请前往创建或者联系管理员' });
      }
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `${check.nickName}的个人信息返回成功`, data: check });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 用户所有信息
  async list(page) {
    const { ctx } = this;
    try {
      const { pageSize } = this.config.paginatorConfig;
      const total = await this.ctx.model.User.find({}).ne('status', 0).count();
      if (!total) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: '暂无用户信息' });
      }
      const totals = Math.ceil(total / pageSize);
      if (page > totals) { return [ -2, '无效页码' ]; }
      if (page < 1) { page = 1; }
      const result = await this.ctx.model.User.find({}, { _id: 0, password: 0 }).ne('status', 0).skip((page - 1) * pageSize)
        .limit(pageSize);
      if (!Number(page)) {
        page = 1;
      } else {
        page = Number(page);
      }
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '所有用户信息返回成功', data: result, totals, page });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 修改用户个人信息
  async modify(params) {
    const { ctx } = this;
    try {
      const user = await ctx.model.User.findOne({ $or: [{ phone: params.phone }, { email: params.email }] }).ne('status', 0);
      if (!user) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '查无此账号，请前往创建或者联系管理员' });
      }
      const oldPwd = md5(params.oldPassword);
      if (oldPwd !== user.password) { return Object.assign(ERROR, { msg: '旧密码输入错误，请重新输入' }); }
      const checkParams = [ 'nickName', 'realName', 'phone', 'email', 'password', 'qq', 'wechat', 'address', 'gender' ];
      const newData = new Map();
      params.password = md5(params.newPassword);
      if (oldPwd === params.password) { return Object.assign(ERROR, { msg: '新密码不得和旧密码一模一样，请重新输入' }); }
      const paramsMap = new Map(Object.entries(params));
      const newUser = new Map(Object.entries(user.toObject()));
      for (const k of paramsMap.keys()) {
        if (params[k] !== newUser.get(k)) {
          if (!checkParams.includes(k)) { continue; }
          if (!params[k]) { continue; }
          newData.set(k, params[k]);
        }
      }
      if (!newData.size) { return Object.assign(ERROR, { msg: '没有进行任何修改' }); }
      const obj = Object.create(null);
      for (const [ k, v ] of newData) {
        obj[k] = v;
      }
      obj.updateTime = Math.round(new Date() / 1000);
      await this.ctx.model.User.updateOne({ $or: [{ phone: params.phone }, { email: params.email }] }, obj);
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '用户个人信息修改成功' });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
}
module.exports = UserService;
