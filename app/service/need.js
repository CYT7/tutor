/**
 * @author: Chen yt7
 * @date: 2020/12/21 3:15 PM
 */
'use strict';

const Service = require('egg').Service;
const md5 = require('js-md5');
const jwt = require('../utils/jwt');
const { ERROR, SUCCESS } = require('../utils/restful');

class NeedService extends Service {
  // 创建需求
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
        subject: params.subject,
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
      const teacher = await this.ctx.model.Teacher.findOne({ User: user }).ne('status', 0);
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
      const need = await ctx.model.Need.findOne({ id: params.id });
      if (!need) {
        return Object.assign(ERROR, { msg: '查无此需求' });
      }
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `${need.id} 返回信息成功`, result: need });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 审核需求 - 通过
  async agree(params) {
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
      const need = await ctx.model.Need.findOne({ id: params.id, state: 3 });
      if (!need) { return Object.assign(ERROR, { msg: '查无此需求' }); }
      const teacher = await ctx.model.Teacher.findOne({ id: params.teacherId }).ne('status', 0);
      if (!teacher) { return Object.assign(ERROR, { msg: '查无此老师' }); }
      await this.ctx.model.Need.updateOne({ id: need.id }, { state: 4, total_appoint: params.teacherId });
      await this.ctx.model.Appoint.create({
        id: md5(Math.random().toString(36).substr(3, 5)),
        need,
        student: user,
        teacher,
        frequency: need.frequency,
        timeHour: need.timeHour,
        hourPrice: need.hourPrice,
        totalPrice: need.totalPrice,
        name: need.nickName,
        phone: need.phone,
        qq: need.qq,
        wechat: need.wechat,
        address: need.address,
        subject: need.subject,
        createTime: Math.round(new Date() / 1000),
      });
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '此需求已经选定老师' });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }

  // 需求已完成
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
      const need = await ctx.model.Need.findOne({ id: params.id }).ne('state', 6);
      if (!need) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '查无此需求' });
      }
      await this.ctx.model.Need.updateOne({ id: need.id }, { state: 6, reason: params.reason });
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '需求已经关闭' });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 修改需求（审核不通过）
  async modify(params) {
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
      const need = await ctx.model.Need.findOne({ id: params.id, state: 2 });
      if (!need) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '查无此需求' });
      }
      const checkParams = [ 'nickName', 'phone', 'wechat', 'qq', 'gender', 'teacherGender', 'address', 'teach_date', 'frequency', 'timeHour', 'hourPrice', 'totalPrice' ];
      const newData = new Map();
      const paramsMap = new Map(Object.entries(params));
      const newNeed = new Map(Object.entries(need.toObject()));
      for (const k of paramsMap.keys()) {
        if (params[k] !== newNeed.get(k)) {
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
      obj.state = 1;
      await this.ctx.model.Need.updateOne({ id: need.id }, obj);
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '需求信息修改成功，待审核' });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 所有需求信息
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
      const { pageSize } = this.config.paginatorConfig;
      const total = await this.ctx.model.Need.find({ User: user }).ne('status', 0).count();
      if (!total) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: '暂无需求信息' });
      }
      const totals = Math.ceil(total / pageSize);
      if (page > totals) { return [ -2, '无效页码' ]; }
      if (page < 1) { page = 1; }
      const NeedResult = await this.ctx.model.Need.find({ User: user }).ne('status', 0).skip((page - 1) * pageSize)
        .limit(pageSize);
      if (!Number(page)) {
        page = 1;
      } else {
        page = Number(page);
      }
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '所有需求信息返回成功', NeedResult, totals, page });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 所有需求信息
  async adminList(page) {
    const { ctx, app } = this;
    try {
      const results = jwt(app, ctx.request.header.authorization);
      if (results[0]) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '请求失败' });
      }
      const { pageSize } = this.config.paginatorConfig;
      const total = await this.ctx.model.Need.find({}).ne('status', 0).count();
      if (!total) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: '暂无需求信息' });
      }
      const totals = Math.ceil(total / pageSize);
      if (page > totals) { return [ -2, '无效页码' ]; }
      if (page < 1) { page = 1; }
      const NeedResult = await this.ctx.model.Need.find({}).ne('status', 0).skip((page - 1) * pageSize)
        .limit(pageSize);
      if (!Number(page)) {
        page = 1;
      } else {
        page = Number(page);
      }
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '所有需求信息返回成功', NeedResult, totals, page });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
}
module.exports = NeedService;
