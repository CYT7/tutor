/**
 * @author: Chen yt7
 * @date: 2020/12/22 1:45 PM
 * @CompletionDate：2020/01/26 4:10PM
 */
'use strict';
const Service = require('egg').Service;
const jwt = require('../utils/jwt');
class AppointService extends Service {
  // 生成预约
  async create(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
    const Teacher = await ctx.model.Teacher.findOne({ id: params.id }).ne('status', 0);
    if (!Teacher) { return [ 400617, '老师不存在' ]; }
    const newAppoint = new ctx.model.Appoint({
      id: 'A' + new Date().getTime(),
      student: user,
      teacher: Teacher,
      frequency: params.frequency,
      timeHour: params.timeHour,
      teach_date: params.teach_date,
      hourPrice: Teacher.hourPrice,
      name: params.name,
      phone: params.phone,
      wechat: params.wechat,
      qq: params.qq,
      address: params.address,
      subject: params.subject,
      createTime: Math.round(new Date() / 1000),
    });
    newAppoint.totalPrice = newAppoint.frequency * newAppoint.timeHour * newAppoint.hourPrice;
    newAppoint.save();
    return [ 0, '预约创建成功', results[1], results[2] ];
  }
  // 同意预约
  async agree(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
    const teacher = await ctx.model.Teacher.findOne({ User: user }).ne('status', 0);
    if (!teacher) { return [ -2, '你不是老师' ]; }
    const result = await ctx.model.Appoint.findOne({ teacher, id: params.id, status: 0 }).ne('status', 0);
    if (!result) { return [ 400616, '查无此预约信息' ]; }
    await this.ctx.model.Appoint.updateOne({ id: params.id }, { state: 1 });
    return [ 0, '老师同意预约', results[1], results[2] ];
  }
  // 不同意预约
  async disagree(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
    const teacher = await ctx.model.Teacher.findOne({ User: user }).ne('status', 0);
    if (!teacher) { return [ -2, '你不是老师' ]; }
    const result = await ctx.model.Appoint.findOne({ teacher, id: params.id, status: 0 }).ne('status', 0);
    if (!result) { return [ 400616, '查无此预约信息' ]; }
    await this.ctx.model.Appoint.updateOne({ id: params.id }, { state: 4 });
    return [ 0, '老师不同意预约', results[1], results[2] ];
  }
  // 付款预约
  async pay(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
    const result = await ctx.model.Appoint.findOne({ student: user, id: params.id, status: 1 }).ne('status', 0);
    if (!result) { return [ 400614, '查无此预约信息' ]; }
    const appointPrice = result.totalPrice;
    if (user.balance < appointPrice) { return [ 400614, '余额不足，请充值' ]; }
    user.balance -= appointPrice;
    user.save();
    await this.ctx.model.Appoint.updateOne({ id: params.id }, { state: 2 });
    return [ 0, '预约已经付款', results[1], results[2] ];
  }
  // 完成预约
  async finish(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
    const teacher = await ctx.model.Teacher.findOne({ User: user }).ne('status', 0);
    if (!teacher) { return [ -2, '你不是老师' ]; }
    const result = await ctx.model.Appoint.findOne({ teacher, id: params.id, status: 2 }).ne('status', 0);
    if (!result) { return [ 400613, '查无此预约信息' ]; }
    await this.ctx.model.Appoint.updateOne({ id: params.id }, { state: 3 });
    return [ 0, '预约已经完成了', results[1], results[2] ];
  }
  // 关闭预约
  async close(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
    const result = await ctx.model.Appoint.findOne({ student: user, id: params.id }).ne('status', 0);
    if (!result) { return [ 400612, '查无此预约信息' ]; }
    await this.ctx.model.Appoint.updateOne({ id: params.id }, { state: 4 });
    return [ 0, '预约已经关闭', results[1], results[2] ];
  }
  // 老师查看某一预约
  async teacherSee(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
    const teacher = await ctx.model.Teacher.findOne({ User: user }).ne('status', 0);
    if (!teacher) { return [ -2, '你不是老师' ]; }
    const result = await ctx.model.Appoint.findOne({ teacher, id: params.id }).ne('status', 0);
    if (!result) { return [ 400610, '查无此预约信息' ]; }
    return [ 0, '预约信息返回成功', result, results[1], results[2] ];
  }
  // 家长查看某一预约
  async userSee(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
    const teacher = await ctx.model.Teacher.findOne({ User: user }).ne('status', 0);
    if (!teacher) if (!user) { return [ -2, '你不是老师' ]; }
    const result = await ctx.model.Appoint.findOne({ student: user, id: params.id }).ne('status', 0);
    if (!result) { return [ 400611, '查无此预约信息' ]; }
    return [ 0, '预约信息返回成功', result, results[1], results[2] ];
  }
  // 用户查看所有预约
  async userList(page) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
    const { pageSize } = this.config.paginatorConfig;
    const total = await this.ctx.model.Appoint.find({ student: user }).ne('status', 0).count();
    if (!total) { return [ 400609, '暂无需求信息' ]; }
    const totals = Math.ceil(total / pageSize);
    if (page > totals) { return [ -2, '无效页码' ]; }
    if (page < 1) { page = 1; }
    const appointResult = await this.ctx.model.Appoint.find({ student: user }).ne('status', 0).skip((page - 1) * pageSize)
      .limit(pageSize);
    if (!Number(page)) {
      page = 1;
    } else {
      page = Number(page);
    }
    return [ 0, '所有用户信息返回成功', appointResult, totals, page, results[1], results[2] ];
  }
  // 老师查看所有预约
  async teacherList(page) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
    const teacher = await ctx.model.Teacher.findOne({ User: user }).ne('status', 0);
    if (!teacher) { return [ -2, '你不是老师' ]; }
    const { pageSize } = this.config.paginatorConfig;
    const total = await this.ctx.model.Appoint.find({ teacher }).ne('status', 0).count();
    if (!total) { return [ 400608, '暂无预约信息' ]; }
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
    return [ 0, '所有预约信息返回成功', appointResult, totals, page, results[1], results[2] ];
  }
  // 管理员查看所有预约
  async adminList(page) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const { pageSize } = this.config.paginatorConfig;
    const total = await this.ctx.model.Appoint.find({}).ne('status', 0).count();
    if (!total) { return [ 404504, '暂无预约信息' ]; }
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
    return [ 0, '所有用户信息返回成功', AppointResult, totals, page, results[1], results[2] ];
  }
}
module.exports = AppointService;
