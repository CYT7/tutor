/**
 * @author: Chen yt7
 * @date: 2020/12/12 2:30 PM
 * @modifyDate：2020/12/20 4：00PM
 */
'use strict';

const Service = require('egg').Service;
const md5 = require('js-md5');
const jwt = require('../utils/jwt');
const { ERROR, SUCCESS } = require('../utils/restful');

class AdminService extends Service {
  // 创建管理员
  async create(params) {
    const { ctx, app } = this;
    try {
      const results = jwt(app, ctx.request.header.authorization);
      if (results[0]) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '请求失败' });
      }
      const admin = await ctx.model.Admin.aggregate().sort({ id: -1 });
      const check = await ctx.model.Admin.findOne({ id: admin[0].id + 1 });
      if (check) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: '操作频繁,请稍后再试' });
      }
      const checkName = await ctx.model.Admin.findOne({ name: params.name }).ne('deleted', 0);
      if (checkName) {
        ctx.status = 402;
        return Object.assign(ERROR, { msg: '管理员名已经存在' });
      }
      const newAdmin = await ctx.model.Admin.create({
        id: admin[0].id + 1,
        name: params.name,
        password: md5(params.password),
        realName: params.realName,
        createTime: Math.round(new Date() / 1000),
      });
      newAdmin.save();
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `管理员${newAdmin.name}创建成功` });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 管理员登录
  async login(params) {
    const { ctx, app } = this;
    try {
      if (!params.name && !params.password) {
        ctx.status = 403;
        return Object.assign(ERROR, { msg: '参数异常' });
      }
      const checkAdmin = await ctx.model.Admin.findOne({ name: params.name, status: 1 }).ne('deleted', 0);
      if (!checkAdmin) {
        ctx.status = 404;
        return Object.assign(ERROR, { msg: `不存在管理员${checkAdmin.name}` });
      }
      const accountPwd = checkAdmin.password;
      const checkPwd = md5(params.password);
      if (accountPwd !== checkPwd) {
        ctx.status = 405;
        return Object.assign(ERROR, { msg: '密码错误，请重新输入' });
      }
      const exp = Math.round(new Date() / 1000) + (60 * 60 * 3);
      const token = app.jwt.sign({
        name: params.name,
        iat: Math.round(new Date() / 1000),
        exp,
      }, app.config.jwt.secret);
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `${checkAdmin.name} 登录成功，欢迎回来`, token, exp });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 管理员个人信息
  async information() {
    const { ctx, app } = this;
    try {
      const results = jwt(app, ctx.request.header.authorization);
      if (results[0]) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '请求失败' });
      }
      if (!results[3]) {
        ctx.status = 403;
        return Object.assign(ERROR, { msg: '参数异常' });
      }
      const adminInformation = await ctx.model.Admin.findOne({ name: results[3] }, { _id: 0, id: 0, password: 0 });
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '管理员个人信息返回成功', data: adminInformation });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 修改管理员个人信息
  async modify(params) {
    const { ctx, app } = this;
    try {
      const results = jwt(app, ctx.request.header.authorization);
      if (results[0]) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '请求失败' });
      }
      const admin = await ctx.model.Admin.findOne({ name: results[3] });
      if (!admin) {
        ctx.status = 406;
        return Object.assign(ERROR, { msg: '不存在该管理员' });
      }
      const oldPwd = md5(params.oldPassword);
      if (oldPwd !== admin.password) { return Object.assign(ERROR, { msg: '旧密码输入错误，请重新输入' }); }
      const checkParams = [ 'realname', 'password' ];
      const newData = new Map();
      params.password = md5(params.newPassword);
      if (oldPwd === params.password) { return Object.assign(ERROR, { msg: '新密码不能和旧密码一模一样，请重新输入' }); }
      const paramMap = new Map(Object.entries(params));
      const newAdmin = new Map(Object.entries(admin.toObject()));
      for (const k of paramMap.keys()) {
        if (params[k] !== newAdmin.get(k)) {
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
      await this.ctx.model.Admin.updateOne({ name: admin.name }, obj);
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `管理员${admin.name}信息修改成功` });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }

  async list(page) {
    const { ctx, app } = this;
    try {
      const results = jwt(app, ctx.request.header.authorization);
      if (results[0]) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '请求失败' });
      }
      const { pageSize } = this.config.paginatorConfig;
      const total = await this.ctx.model.Admin.find({}).ne('deleted', 0).count();
      if (!total) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: '暂无管理员信息' });
      }
      const totals = Math.ceil(total / pageSize);
      if (page > totals) { return [ -2, '无效页码' ]; }
      if (page < 1) { page = 1; }
      const adminResult = await this.ctx.model.Admin.find({}).ne('deleted', 0).skip((page - 1) * pageSize)
        .limit(pageSize);
      if (!Number(page)) {
        page = 1;
      } else {
        page = Number(page);
      }
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '所有管理员信息返回成功', adminResult, totals, page });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 删除管理员
  async delete(params) {
    const { ctx, app } = this;
    try {
      const results = jwt(app, ctx.request.header.authorization);
      if (results[0]) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '请求失败' });
      }
      const admin = await ctx.model.Admin.findOne({ name: results[3] });
      if (!admin) {
        ctx.status = 406;
        return Object.assign(ERROR, { msg: '不存在该管理员' });
      }
      const check = await ctx.model.Admin.findOne({ id: params.id }).ne('deleted', 0);
      if (!check) {
        ctx.status = 407;
        return Object.assign(ERROR, { msg: `该管理员${check.name}不存在或已经被软删除了` });
      }
      await this.ctx.model.Admin.updateOne({ id: check.id }, { deleted: 0 });
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `${check.name}已经被软删除，执行人是${admin.name}` });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }

  // 管理员dashboard
  async dashboard() {
    const { ctx, app } = this;
    try {
      const results = jwt(app, ctx.request.header.authorization);
      if (results[0]) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '请求失败' });
      }
      const admin = await ctx.model.Admin.findOne({ name: results[3] });
      if (!admin) {
        ctx.status = 406;
        return Object.assign(ERROR, { msg: '不存在该管理员' });
      }
      const adminCount = await ctx.model.Admin.find({ deleted: 1 }).count();
      const userCount = await ctx.model.User.find({ status: 1 }).count();
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '信息返回成功', adminCount, userCount });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }

}
module.exports = AdminService;
