/**
 * @author: Chen yt7
 * @date: 2020/12/16 2:00 PM
 */
'use strict';

const Service = require('egg').Service;
const md5 = require('js-md5');
const { ERROR, SUCCESS } = require('../utils/restful');

class NeedService extends Service {
  // 创建需求
  async create(params) {
    const { ctx } = this;
    try {
      const user = await ctx.model.User.findOne({ $or: [{ phone: params.phone }, { email: params.email }] }).ne('status', 0);
      if (!user) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '参数异常' });
      }
      const need = await ctx.model.Need.create({
        id: md5(Math.random().toString(36).substr(3, 5) + Date.now().toString(36)),
        User: user,
        nickName: params.nickName,
        phone: params.phone,
        wechat: params.wechat,
        qq: params.qq,
        gender: params.gender,
        teacherGender: params.teacherGender,
        address: params.address,
        teach_date: params.teach_date,
        frequency: params.frequency,
        timeHour: params.timeHour,
        hourPrice: params.hourPrice,
        createTime: Math.round(new Date() / 1000),
      });
      need.totalPrice = need.frequency * need.timeHour * need.hourPrice;
      need.save();
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '需求创建成功，待管理员审核' });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 申请需求(老师申请执教）
  async apply(params) {
    const { ctx } = this;
    try {
      const teacher = await this.ctx.model.Teacher.findOne({ id: params.teacherId }).ne('status', 0);
      if (!teacher) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: 'sorry，你暂无执教资格，请前往申请' });
      }
      const need = await ctx.model.Need.findOne({ id: params.id, state: 3 }).ne('status', 0);
      if (!need) { return Object.assign(ERROR, { msg: 'sorry,查无此需求' }); }
      need.total_appoint += `${teacher}`;
      need.save();
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '该需求你申请成功，请等家长选择' });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 查看需求信息
  async information(params) {
    const { ctx } = this;
    try {
      const user = await ctx.model.User.findOne({ $or: [{ phone: params.phone }, { email: params.email }] }).ne('status', 0);
      if (!user) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '参数异常' });
      }
      const need = await ctx.model.Need.findOne({ id: params.id });
      if (!need) {
        return Object.assign(ERROR, { msg: '查无此需求' });
      }
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `${need.id} 返回信息成功`, data: need });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 审核需求 - 通过
  async agree(params) {
    const { ctx } = this;
    try {
      const admin = await ctx.model.Admin.findOne({ name: params.name }).ne('deleted', 0);
      if (!admin) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: '查无此管理员' });
      }
      const need = await ctx.model.Need.findOne({ id: params.id, state: 1 });
      if (!need) { return Object.assign(ERROR, { msg: '查无此需求' }); }
      await this.ctx.model.Need.updateOne({ id: need.id }, { state: 3 });
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `${need.id} 审核通过` });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 审核需求 - 不通过
  async disagree(params) {
    const { ctx } = this;
    try {
      const admin = await ctx.model.Admin.findOne({ name: params.name }).ne('deleted', 0);
      if (!admin) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: '查无此管理员' });
      }
      const need = await ctx.model.Need.findOne({ id: params.id, state: 1 });
      if (!need) { return Object.assign(ERROR, { msg: '查无此需求' }); }
      await this.ctx.model.Need.updateOne({ id: need.id }, { state: 2 });
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `${need.id} 审核不通过` });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 需求已选定老师
  async confirm(params) {
    const { ctx } = this;
    try {
      const user = await ctx.model.User.findOne({ $or: [{ phone: params.phone }, { email: params.email }] }).ne('status', 0);
      if (!user) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '参数异常' });
      }
      const need = await ctx.model.Need.findOne({ id: params.id, state: 3 });
      if (!need) { return Object.assign(ERROR, { msg: '查无此需求' }); }
      const teacher = await ctx.model.Teacher.findOne({ id: params.teacherId }).ne('status', 0);
      if (!teacher) { return Object.assign(ERROR, { msg: '查无此需求' }); }
      await this.ctx.model.Need.updateOne({ id: need.id }, { state: 4, total_appoint: params.teacherId });
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `${need.id} 已经选定老师` });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }

  // 需求已完成
  async finish(params) {
    const { ctx } = this;
    try {
      const user = await ctx.model.User.findOne({ $or: [{ phone: params.phone }, { email: params.email }] }).ne('status', 0);
      if (!user) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '参数异常' });
      }
      const need = await ctx.model.Need.findOne({ id: params.id, state: 4 });
      if (!need) { return Object.assign(ERROR, { msg: '查无此需求' }); }
      await this.ctx.model.Need.updateOne({ id: need.id }, { state: 5 });
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `${need.id} 需求已经完成` });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 关闭需求
  async close() {
    const { ctx } = this;
    try {
      // todo
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 修改需求（审核不通过）
  async modify() {
    const { ctx } = this;
    try {
      // todo
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 所有需求信息
  async list() {
    const { ctx } = this;
    try {
      // todo
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 所有需求信息
  async adminList() {
    const { ctx } = this;
    try {
      // todo
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
}
module.exports = NeedService;
