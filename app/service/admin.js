/**
 * @author: Chen yt7
 * @date: 2020/12/12 2:30 PM
 * @modifyDate：2020/12/17 7：45PM
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
      const check = await ctx.model.Admin.findOne({ name: params.name }).ne('deleted', 0);
      if (check) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '用户名已经存在' });
      }
      const admin = await ctx.model.Admin.aggregate().sort({ id: -1 });
      const newAdmin = await ctx.model.Admin.create({
        id: admin[0].id + 1,
        name: params.name,
        password: md5(params.password),
        realName: params.realName,
        createTime: Math.round(new Date() / 1000),
      });
      newAdmin.save();
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `管理员${newAdmin.name}成功` });
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
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '参数异常' });
      }
      const checkAdmin = await ctx.model.Admin.findOne({ name: params.name, status: 1 }).ne('deleted', 0);
      if (!checkAdmin) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: `管理员${checkAdmin.name}被禁用或删除了，请联系超级管理员` });
      }
      const accountPwd = checkAdmin.password;
      const checkPwd = md5(params.password);
      if (accountPwd !== checkPwd) {
        ctx.status = 402;
        return Object.assign(ERROR, { msg: '密码错误，请重新输入' });
      }
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `${checkAdmin.name} 登录成功，欢迎回来` });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 管理员个人信息
  async information(params) {
    const { ctx } = this;
    try {
      const admin = await ctx.model.Admin.findOne({ name: params.name }).ne('deleted', 0);
      if (!admin) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: `不存在该管理员${admin.name}` });
      }
      const adminInformation = await ctx.model.Admin.findOne({ name: params.name }, { _id: 0, id: 0, password: 0 });
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '管理员个人信息返回成功', data: adminInformation });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 修改管理员个人信息
  async modify(params) {
    const { ctx } = this;
    try {
      const admin = await ctx.model.Admin.findOne({ name: params.name }).ne('deleted', 0);
      if (!admin) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: `不存在该管理员${admin.name}` });
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
      await this.ctx.model.Admin.updateOne({ name: params.name }, obj);
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `管理员${admin.name}信息修改成功` });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }

  async list(page) {
    const { ctx } = this;
    try {
      const { pageSize } = this.config.paginatorConfig;
      const total = await this.ctx.model.Admin.find({}).ne('deleted', 0).count();
      if (!total) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: '暂无管理员信息' });
      }
      const totals = Math.ceil(total / pageSize);
      if (page > totals) { return [ -2, '无效页码' ]; }
      if (page < 1) { page = 1; }
      const result = await this.ctx.model.Admin.find({}).ne('deleted', 0).skip((page - 1) * pageSize)
        .limit(pageSize);
      if (!Number(page)) {
        page = 1;
      } else {
        page = Number(page);
      }
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '所有管理员信息返回成功', result, totals, page });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 删除管理员
  async delete(params) {
    const { ctx } = this;
    try {
      const admin = await ctx.model.Admin.findOne({ name: params.name }).ne('deleted', 0);
      if (!admin) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: `不存在该管理员${admin.name}` });
      }
      const check = await ctx.model.Admin.findOne({ id: params.id }).ne('deleted', 0);
      if (!check) {
        ctx.status = 401;
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

}
module.exports = AdminService;
