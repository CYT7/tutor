/**
 * @author: Chen yt7
 * @date: 2020/12/12 2:30 PM
 * @CompletionDate：2021/02/06 9:35AM
 */
'use strict';
const Service = require('egg').Service;
const md5 = require('js-md5');
const jwt = require('../utils/jwt');
class AdminService extends Service {
  // 创建管理员
  async create(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const admin = await ctx.model.Admin.aggregate().sort({ id: -1 });
    const checkName = await ctx.model.Admin.findOne({ name: params.name }).ne('deleted', 0);
    if (checkName) { return [ 404002, '管理员名已经存在' ]; }
    const newAdmin = await ctx.model.Admin.create({
      id: admin[0].id + 1,
      name: params.name,
      password: md5(params.password),
      realName: params.realName,
      createTime: Math.round(new Date() / 1000),
    });
    newAdmin.save();
    return [ 0, `管理员${newAdmin.name}创建成功`, results[1], results[2] ];
  }
  // 管理员登录
  async login(params) {
    const { ctx, app } = this;
    const checkAdmin = await ctx.model.Admin.findOne({ name: params.name, status: 1 }).ne('deleted', 0);
    if (!checkAdmin) { return [ -1, `${checkAdmin.name}不存在` ]; }
    const accountPwd = checkAdmin.password;
    const checkPwd = md5(params.password);
    if (accountPwd !== checkPwd) { return [ 404001, '管理员密码错误，请重新输入' ]; }
    const exp = Math.round(new Date() / 1000) + (60 * 60 * 3);
    const token = app.jwt.sign({
      name: params.name,
      iat: Math.round(new Date() / 1000),
      exp,
    }, app.config.jwt.secret);
    await this.ctx.model.Admin.updateOne({ name: params.name }, { loginTime: Math.round(new Date() / 1000) });
    return [ 0, `${checkAdmin.name} 登录成功，欢迎回来`, token, exp ];
  }
  // 管理员个人信息
  async information() {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    if (!results[3]) { return [ -2, '参数异常' ]; }
    const adminInformation = await ctx.model.Admin.findOne({ name: results[3] }, { _id: 0, password: 0 });
    if (!adminInformation) { return [ 404003, `不存在管理员${results[3]}` ]; }
    return [ 0, '管理员个人信息返回成功', adminInformation, results[1], results[2] ];
  }
  // 修改管理员个人信息
  async modify(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const admin = await ctx.model.Admin.findOne({ name: results[3] });
    if (!admin) { return [ -2, '参数异常' ]; }
    if ((params.oldPassword !== '') && (params.newPassword !== '')) {
      const oldPwd = md5(params.oldPassword);
      if (oldPwd !== admin.password) { return [ 404004, '旧密码输入错误，请重新输入' ]; }
      params.password = md5(params.newPassword);
      if (oldPwd === params.password) { return [ 404004, '新密码不能和旧密码一模一样，请重新输入' ]; }
    }
    const checkParams = [ 'password', 'realName' ];
    const newData = new Map();
    const paramMap = new Map(Object.entries(params));
    const newAdmin = new Map(Object.entries(admin.toObject()));
    for (const k of paramMap.keys()) {
      if (params[k] !== newAdmin.get(k)) {
        if (!checkParams.includes(k)) { continue; }
        if (!params[k]) { continue; }
        newData.set(k, params[k]);
      }
    }
    if (!newData.size) { return [ 404004, `管理员${results[3]}没进行任何修改` ]; }
    const obj = Object.create(null);
    for (const [ k, v ] of newData) {
      obj[k] = v;
    }
    obj.updateTime = Math.round(new Date() / 1000);
    await this.ctx.model.Admin.updateOne({ name: admin.name }, obj);
    return [ 0, `管理员${admin.name}信息修改成功`, results[1], results[2] ];
  }
  // 修改某个管理员的个人信息
  async modifyAdmin(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const updateAdmin = await ctx.model.Admin.findOne({ id: params.id, deleted: 1 });
    if (!updateAdmin) { return [ 404005, '不存在此管理员，请稍后重试' ]; }
    if (params.password) { params.password = md5(params.password); }
    const checkParams = [ 'password', 'realName' ];
    const newData = new Map();
    const paramMap = new Map(Object.entries(params));
    const newAdmin = new Map(Object.entries(updateAdmin.toObject()));
    for (const k of paramMap.keys()) {
      if (params[k] !== newAdmin.get(k)) {
        if (!checkParams.includes(k)) { continue; }
        if (!params[k]) { continue; }
        newData.set(k, params[k]);
      }
    }
    if (!newData.size) { return [ 404005, `管理员${results[3]}没进行任何修改` ]; }
    const obj = Object.create(null);
    for (const [ k, v ] of newData) {
      obj[k] = v;
    }
    obj.updateTime = Math.round(new Date() / 1000);
    await this.ctx.model.Admin.updateOne({ id: params.id }, obj);
    return [ 0, `管理员${updateAdmin.name}信息修改成功`, results[1], results[2] ];
  }
  // 管理员列表
  async list(page) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const { pageSize } = this.config.paginatorConfig;
    const total = await this.ctx.model.Admin.find({}).ne('deleted', 0).countDocuments();
    if (!total) { return [ 404006, '暂无管理员信息' ]; }
    const totals = Math.ceil(total / pageSize);
    if (page > totals) { return [ -2, '无效页码' ]; }
    if (page < 1) { page = 1; }
    const adminResult = await this.ctx.model.Admin.find({}, { _id: 0, password: 0 }).ne('deleted', 0).skip((page - 1) * pageSize)
      .limit(pageSize);
    if (!Number(page)) {
      page = 1;
    } else {
      page = Number(page);
    }
    return [ 0, '所有管理员信息返回成功', adminResult, totals, page, results[1], results[2] ];
  }
  // 删除管理员
  async delete(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const check = await ctx.model.Admin.findOne({ id: params.id }).ne('deleted', 0);
    if (!check) { return [ 404007, '该管理员不存在或已经被软删除了' ]; }
    await this.ctx.model.Admin.updateOne({ id: check.id }, { deleted: 0 });
    return [ 0, `该管理员${check.name}软删除了，执行人是${results[3]}`, results[1], results[2] ];
  }
  // dashboard仪表盘
  async dashboard() {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const adminCount = await ctx.model.Admin.find({ deleted: 1 }).count();
    const userCount = await ctx.model.User.find({ status: 1 }).count();
    const teacherCount = await ctx.model.Teacher.find({ status: 1 }).count();
    const appointCount = await ctx.model.Appoint.find({}).count();
    const needCount = await ctx.model.Need.find({}).count();
    const resultMap = {};
    resultMap.adminCount = adminCount;
    resultMap.userCount = userCount;
    resultMap.teacherCount = teacherCount;
    resultMap.appointCount = appointCount;
    resultMap.needCount = needCount;
    return [ 0, '信息返回成功', resultMap ];
  }
}
module.exports = AdminService;
