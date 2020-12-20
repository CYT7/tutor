/**
 * @author: Chen yt7
 * @date: 2020/12/15 1:03 PM
 */
'use strict';

const Service = require('egg').Service;
const jwt = require('../utils/jwt');
const { ERROR, SUCCESS } = require('../utils/restful');

class TeacherService extends Service {
  // 创建老师
  async create(params) {
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
      const teacher = await ctx.model.Teacher.aggregate().sort({ id: -1 });
      const newTeacher = new ctx.model.Teacher({
        User: user,
        experience: params.experience,
        age: params.age,
        hourPrice: params.hourPrice,
        goodAt: params.goodAt,
        createTime: Math.round(new Date() / 1000),
      });
      if (!teacher.length) {
        newTeacher.id = 'T' + new Date().getFullYear().toString()
          .substr(2, 2) + '01';
        newTeacher.save();
        ctx.status = 201;
        return Object.assign(SUCCESS, { msg: `${user.nickName} 申请做家教成功，请等待管理员审核` });
      }
      const Id = Number(teacher[0].id.substr(1));
      newTeacher.id = `T${Id + 1}`;
      newTeacher.save();
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `${user.nickName} 申请做家教成功，请等待管理员审核` });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 查看教师个人信息
  async information() {
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
      const teacherResult = await ctx.model.Teacher.findOne({ User: user }).populate({ path: 'User', select: { _id: 0, password: 0, id: 0 } });
      if (!teacherResult) { return Object.assign(ERROR, { msg: '你尚未申请做家教，请前往申请' }); }
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `${user.nickName}个人信息返回成功`, data: teacherResult });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 修改家教个人信息
  async modify(params) {
    const { ctx } = this;
    try {
      const user = await ctx.model.User.findOne({ $or: [{ phone: params.phone }, { email: params.email }] }).ne('status', 0);
      if (!user) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '查无此账号，请前往创建或者联系管理员' });
      }
      const teacher = await ctx.model.Teacher.findOne({ User: user });
      if (!teacher) { return Object.assign(ERROR, { msg: '你尚未申请做家教，请前往申请' }); }
      const checkParams = [ 'experience', 'age', 'goodAt', 'hourPrice' ];
      const newData = new Map();
      const paramsMap = new Map(Object.entries(params));
      const newTeacher = new Map(Object.entries(teacher.toObject()));
      for (const k of paramsMap.keys()) {
        if (params[k] !== newTeacher.get(k)) {
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
      obj.state = 1;
      obj.updateTime = Math.round(new Date() / 1000);
      await this.ctx.model.Teacher.updateOne({ User: user }, obj);
      return Object.assign(SUCCESS, { msg: '家教个人信息修改成功' });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 管理员审核通过
  async agree(params) {
    const { ctx } = this;
    try {
      const admin = await ctx.model.Admin.findOne({ name: params.name });
      if (!admin) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: '管理员账号不存在' });
      }
      const teacher = await ctx.model.Teacher.findOne({ id: params.id }).ne('status', 0);
      if (!teacher) {
        return Object.assign((ERROR, { msg: '不存在该老师，参数异常' }));
      }
      await this.ctx.model.Teacher.updateOne({ id: teacher.id }, { state: 3 });
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `${teacher.User}审核通过` });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 管理员审核不通过
  async disagree(params) {
    const { ctx } = this;
    try {
      const admin = await ctx.model.Admin.findOne({ name: params.name });
      if (!admin) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: '管理员账号不存在' });
      }
      const teacher = await ctx.model.Teacher.findOne({ id: params.id }).ne('status', 0);
      if (!teacher) {
        return Object.assign((ERROR, { msg: '不存在该老师，参数异常' }));
      }
      await this.ctx.model.Teacher.updateOne({ id: teacher.id }, { state: 2 });
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `${teacher.User}审核不通过` });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 所有教师信息列表
  async list(page) {
    const { ctx } = this;
    try {
      const { pageSize } = this.config.paginatorConfig;
      const total = await this.ctx.model.Teacher.find({}).count();
      if (!total) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: '暂无教师信息' });
      }
      const totals = Math.ceil(total / pageSize);
      if (page > totals) { return [ -2, '无效页码' ]; }
      if (page < 1) { page = 1; }
      const result = await this.ctx.model.Teacher.find({}).skip((page - 1) * pageSize).limit(pageSize);
      if (!Number(page)) {
        page = 1;
      } else {
        page = Number(page);
      }
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '所有教师信息返回成功', data: result, totals, page });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
}
module.exports = TeacherService;
