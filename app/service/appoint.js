/**
 * @author: Chen yt7
 * @date: 2020/12/22 1:45 PM
 */
'use strict';

const Service = require('egg').Service;
const jwt = require('../utils/jwt');
const { ERROR, SUCCESS } = require('../utils/restful');

class AppointService extends Service {
  // 完成预约
  async finish(params) {
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
      const teacher = await ctx.model.Teacher.findOne({ User: user }).ne('status', 0);
      if (!teacher) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '你不是老师' });
      }
      const result = await ctx.model.Appoint.findOne({ teacher, id: params.id }).ne('status', 0);
      if (!result) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '查无此预约信息' });
      }
      await this.ctx.model.Appoint.updateOne({ id: params.id }, { state: 7 });
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '预约已经完成了' });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 关闭预约
  async close(params) {
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
      const teacher = await ctx.model.Teacher.findOne({ User: user }).ne('status', 0);
      if (!teacher) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '你不是老师' });
      }
      const result = await ctx.model.Appoint.findOne({ teacher, id: params.id }).ne('status', 0);
      if (!result) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '查无此预约信息' });
      }
      await this.ctx.model.Appoint.updateOne({ id: params.id }, { state: 8 });
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '预约已经关闭' });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 查看某一预约
  async see(params) {
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
      const teacher = await ctx.model.Teacher.findOne({ User: user }).ne('status', 0);
      if (!teacher) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '你不是老师' });
      }
      const result = await ctx.model.Appoint.findOne({ teacher, id: params.id }).ne('status', 0);
      if (!result) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '查无此预约信息' });
      }
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '预约信息返回成功', result });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 查看所有预约
  async list(page) {
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
      const teacher = await ctx.model.Teacher.findOne({ User: user }).ne('status', 0);
      if (!teacher) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '你不是老师' });
      }
      const { pageSize } = this.config.paginatorConfig;
      const total = await this.ctx.model.Appoint.find({ teacher }).ne('status', 0).count();
      if (!total) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: '暂无需求信息' });
      }
      const totals = Math.ceil(total / pageSize);
      if (page > totals) { return [ -2, '无效页码' ]; }
      if (page < 1) { page = 1; }
      const appointResult = await this.ctx.model.Appoint.find({ teacher }).ne('status', 0).skip((page - 1) * pageSize)
        .limit(pageSize);
      if (!Number(page)) {
        page = 1;
      } else {
        page = Number(page);
      }
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '所有预约信息返回成功', appointResult, totals, page });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 管理员查看所有预约
  async adminList(page) {
    const { ctx, app } = this;
    try {
      const results = jwt(app, ctx.request.header.authorization);
      if (results[0]) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '请求失败' });
      }
      const { pageSize } = this.config.paginatorConfig;
      const total = await this.ctx.model.Appoint.find({}).ne('status', 0).count();
      if (!total) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: '暂无需求信息' });
      }
      const totals = Math.ceil(total / pageSize);
      if (page > totals) { return [ -2, '无效页码' ]; }
      if (page < 1) { page = 1; }
      const AppointResult = await this.ctx.model.Appoint.find({}).ne('status', 0).skip((page - 1) * pageSize)
        .limit(pageSize);
      if (!Number(page)) {
        page = 1;
      } else {
        page = Number(page);
      }
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '所有需求信息返回成功', AppointResult, totals, page });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
}
module.exports = AppointService;
