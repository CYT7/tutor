/**
 * @author: Chen yt7
 * @date: 2020/12/21 3:15 PM
 */
'use strict';

const Service = require('egg').Service;
const md5 = require('js-md5');
const jwt = require('../utils/jwt');

class NeedService extends Service {
  // 创建需求
  async create(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
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
    return [ 0, '需求创建成功，待管理员审核', results[1], results[2] ];
  }
  // 申请需求(老师申请执教）
  async apply(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
    const teacher = await this.ctx.model.Teacher.findOne({ User: user }).ne('status', 0);
    if (!teacher) { return [ 400601, 'sorry，你暂无执教资格，请前往申请' ]; }
    const need = await ctx.model.Need.findOne({ id: params.id, state: 3 }).ne('status', 0);
    if (!need) { return [ 400601, 'sorry,查无此需求' ]; }
    need.total_appoint += `${teacher}`;
    need.save();
    return [ 0, '该需求你申请成功，请等家长选择', results[1], results[2] ];
  }
  // 查看需求信息
  async information(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
    const need = await ctx.model.Need.findOne({ id: params.id });
    if (!need) { return [ 400602, '查无此需求' ]; }
    return [ 0, `${need.id} 返回信息成功`, need, results[1], results[2] ];
  }
  // 审核需求 - 通过
  async agree(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const admin = await ctx.model.Admin.findOne({ name: results[3] });
    if (!admin) { return [ -1, `不存在管理员${results[3]}` ]; }
    const need = await ctx.model.Need.findOne({ id: params.id, state: 1 });
    if (!need) { return [ 404501, '查无此需求' ]; }
    await this.ctx.model.Need.updateOne({ id: need.id }, { state: 3 });
    return [ 0, `${need.id} 审核通过`, results[1], results[2] ];
  }
  // 审核需求 - 不通过
  async disagree(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const admin = await ctx.model.Admin.findOne({ name: results[3] });
    if (!admin) { return [ -1, `不存在管理员${results[3]}` ]; }
    const need = await ctx.model.Need.findOne({ id: params.id, state: 1 });
    if (!need) { return [ 404502, '查无此需求' ]; }
    await this.ctx.model.Need.updateOne({ id: need.id }, { state: 2 });
    return [ 0, `${need.id} 审核不通过`, results[1], results[2] ];
  }
  // 需求已选定老师
  async confirm(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '用户不存在' ]; }
    const need = await ctx.model.Need.findOne({ id: params.id, state: 3 });
    if (!need) { return [ 400603, '查无此需求' ]; }
    const teacher = await ctx.model.Teacher.findOne({ id: params.teacherId }).ne('status', 0);
    if (!teacher) { return [ 400603, '查无此老师' ]; }
    await this.ctx.model.Need.updateOne({ id: need.id }, { state: 4, total_appoint: params.teacherId });
    return [ 0, '此需求已经选定老师', results[1], results[2] ];
  }

  // 需求已完成
  async finish(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '用户不存在' ]; }
    const need = await ctx.model.Need.findOne({ id: params.id, state: 4 });
    if (!need) { return [ 400604, '查无此需求' ]; }
    await this.ctx.model.Need.updateOne({ id: need.id }, { state: 5 });
    return [ 0, `${need.id} 需求已经完成`, results[1], results[2] ];
  }
  // 关闭需求
  async close(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '用户不存在' ]; }
    const need = await ctx.model.Need.findOne({ id: params.id }).ne('state', 6);
    if (!need) { return [ 400605, '查无此需求' ]; }
    await this.ctx.model.Need.updateOne({ id: need.id }, { state: 6, reason: params.reason });
    return [ 0, `${need.id} 需求已经关闭`, results[1], results[2] ];
  }
  // 修改需求（审核不通过）
  async modify(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '用户不存在' ]; }
    const need = await ctx.model.Need.findOne({ id: params.id, state: 2 });
    if (!need) { return [ 400606, '查无此需求' ]; }
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
    if (!newData.size) { return [ 400606, '没有进行任何修改' ]; }
    const obj = Object.create(null);
    for (const [ k, v ] of newData) {
      obj[k] = v;
    }
    obj.updateTime = Math.round(new Date() / 1000);
    obj.state = 1;
    await this.ctx.model.Need.updateOne({ id: need.id }, obj);
    return [ 0, `${need.id} 需求信息修改成功，待审核`, results[1], results[2] ];
  }
  // 所有需求信息
  async list(page) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '用户不存在' ]; }
    const { pageSize } = this.config.paginatorConfig;
    const total = await this.ctx.model.Need.find({ User: user }).ne('status', 0).count();
    if (!total) { return [ 400607, '暂无需求信息' ]; }
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
    return [ 0, '所有需求信息返回成功', NeedResult, totals, page, results[1], results[2] ];
  }
  // 所有需求信息
  async adminList(page) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const { pageSize } = this.config.paginatorConfig;
    const total = await this.ctx.model.Need.find({}).ne('status', 0).count();
    if (!total) { return [ 404503, '暂无需求信息' ]; }
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
    return [ 0, '所有需求信息返回成功', NeedResult, totals, page, results[1], results[2] ];
  }
}
module.exports = NeedService;
