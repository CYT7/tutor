/**
 * @author: Chen yt7
 * @date: 2020/12/14 10:15 AM
* @modifyDate：2021/02/06 11：00AM
 */
'use strict';

const Service = require('egg').Service;
const md5 = require('js-md5');
const jwt = require('../utils/jwt');
const path = require('path');
const sd = require('silly-datetime');
const mkdirp = require('mkdirp');

class UserService extends Service {
  // 创建用户
  async create(params) {
    const { ctx } = this;
    const checkUser = await ctx.model.User.findOne({ $or: [{ phone: params.phone }, { email: params.email }] });
    if (checkUser) { return [ 400400, '你已经用手机或邮箱创建过了，请前往登录亲' ]; }
    const user = await ctx.model.User.aggregate().sort({ id: -1 });
    const newUser = new ctx.model.User({
      createTime: Math.round(new Date() / 1000),
      phone: params.phone,
      email: params.email,
      password: md5(params.password),
      gender: params.gender,
      address: params.address,
    });
    newUser.nickName = params.nickName;
    if (!params.nickName) {
      const round = Math.round(new Date() / 1000);
      newUser.nickName = '用户' + round;
    }
    if (!user.length) {
      newUser.id = new Date().getFullYear().toString()
        .substr(0, 4) + '01';
      newUser.save();
      return [ 0, '用户创建成功，你可以进行登录了' ];
    }
    newUser.id = user[0].id + 1;
    newUser.save();
    return [ 0, '用户创建成功，你可以进行登录了' ];
  }
  // 用户登录
  async login(params) {
    const { ctx, app } = this;
    const user = await ctx.model.User.findOne({ $or: [{ phone: params.username }, { email: params.username }] }).ne('status', 0);
    if (!user) { return [ 400401, '查无此账号' ]; }
    const pwd = md5(params.password);
    if (pwd !== user.password) { return [ 404401, '登录失败，密码错误' ]; }
    const exp = Math.round(new Date() / 1000) + (60 * 60 * 3);
    const token = app.jwt.sign({
      name: user._id,
      iat: Math.round(new Date() / 1000),
      exp,
    }, app.config.jwt.secret);
    user.loginTime = Math.round(new Date() / 1000);
    user.save();
    return [ 0, `${user.nickName} 登录成功，欢迎回来`, token, exp ];
  }
  // 用户个人信息
  async information() {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    if (!results[3]) { return [ -2, '非法用户' ]; }
    const userInfo = await ctx.model.User.findOne({ _id: results[3] }, { _id: 0, password: 0 }).ne('status', 0);
    if (!userInfo) { return [ 400402, '暂无用户个人信息' ]; }
    return [ 0, `${userInfo.nickName}的个人信息返回成功`, userInfo, results[1], results[2] ];
  }
  // 管理员查看用户所有信息
  async list(page) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const { pageSize } = this.config.paginatorConfig;
    const total = await this.ctx.model.User.find({}).ne('status', 0).countDocuments();
    if (!total) { return [ 404201, '暂无用户信息' ]; }
    const totals = Math.ceil(total / pageSize);
    if (page > totals) { return [ -2, '无效页码' ]; }
    if (page < 1) { page = 1; }
    const userResult = await this.ctx.model.User.find({}, { _id: 0, password: 0 }).ne('status', 0).skip((page - 1) * pageSize)
      .limit(pageSize);
    if (!Number(page)) {
      page = 1;
    } else {
      page = Number(page);
    }
    return [ 0, '所有用户信息返回成功', userResult, totals, page, results[1], results[2] ];
  }
  // 修改用户个人信息
  async modify(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ _id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
    if (params.oldPassword) {
      const oldPwd = md5(params.oldPassword);
      if (oldPwd !== user.password) { return [ 400403, '旧密码输入错误，请重新输入' ]; }
      params.password = md5(params.newPassword);
      if (oldPwd === params.password) { return [ 400403, '新密码不得和旧密码一模一样，请重新输入' ]; }
    }
    const checkParams = [ 'nickName', 'phone', 'email', 'password', 'qq', 'wechat', 'address', 'gender' ];
    const newData = new Map();
    const paramsMap = new Map(Object.entries(params));
    const newUser = new Map(Object.entries(user.toObject()));
    for (const k of paramsMap.keys()) {
      if (params[k] !== newUser.get(k)) {
        if (!checkParams.includes(k)) { continue; }
        if (!params[k]) { continue; }
        newData.set(k, params[k]);
      }
    }
    if (!newData.size) { return [ 400403, '没有进行任何修改' ]; }
    const obj = Object.create(null);
    for (const [ k, v ] of newData) {
      obj[k] = v;
    }
    obj.updateTime = Math.round(new Date() / 1000);
    await this.ctx.model.User.updateOne({ _id: results[3] }, obj);
    ctx.status = 201;
    return [ 0, '用户个人信息修改成功', results[1], results[2] ];
  }
  // 上传头像
  /**
   * 获取文件上传目录
   * @param {*} filename
   */
  async saveAvatar(filename) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ _id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '用户不存在' ]; }
    const day = sd.format(new Date(), 'YYYYMMDD');// 获取当前日期
    const dir = path.join(this.config.uploadDir, day);// 创建图片保存的路径
    await mkdirp(dir);// 不存在就创建目录
    const date = Date.now();// 毫秒数
    const uploadDir = path.join(dir, date + path.extname(filename));
    const saveDir = this.ctx.origin + uploadDir.slice(3).replace(/\\/g, '/');
    await this.ctx.model.User.updateOne({ _id: results[3] }, { image_url: saveDir });
    return { uploadDir, saveDir };
  }
  // 增加余额
  async balanceAdd(param) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ _id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '非法用户' ]; }
    if (param.balance) {
      user.balance += param.balance;
      user.save();
      return [ 0, `余额增加${param.balance / 100}元`, results[1], results[2] ];
    }
    return [ 400405, '增加失败，请增加固定金额' ];
  }
}
module.exports = UserService;
