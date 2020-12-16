/**
 * @author: Chen yt7
 * @date: 2020/12/15 1:03 PM
 */
'use strict';

const Service = require('egg').Service;
const { ERROR, SUCCESS } = require('../utils/restful');

class TeacherService extends Service {
  // 创建老师
  async create(params) {
    const { ctx } = this;
    try {
      const user = await ctx.model.User.findOne({ $or: [{ phone: params.phone }, { email: params.email }] }).ne('status', 0);
      if (!user) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '查无此账号，请前往创建或者联系管理员' });
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
  async information(params) {
    const { ctx } = this;
    try {
      const user = await ctx.model.User.findOne({ $or: [{ phone: params.phone }, { email: params.email }] }).ne('status', 0);
      if (!user) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '查无此账号，请前往创建或者联系管理员' });
      }
      const result = await ctx.model.Teacher.findOne({ User: user });
      if (!result) { return Object.assign(ERROR, { msg: '你尚未申请做家教，请前往申请' }); }
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `${user.nickName}个人信息返回成功`, data: result });
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
      obj.updateTime = Math.round(new Date() / 1000);
      await this.ctx.model.Teacher.updateOne({ User: user }, obj);
      return Object.assign(SUCCESS, { msg: '家教个人信息修改成功' });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }

  }
}
module.exports = TeacherService;
