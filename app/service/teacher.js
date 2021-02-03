/**
 * @author: Chen yt7
 * @date: 2020/12/15 1:03 PM
 * @CompletionDate：2020/01/26 4:00PM
 */
'use strict';

const Service = require('egg').Service;
const jwt = require('../utils/jwt');
const path = require('path');
const sd = require('silly-datetime');
const mkdirp = require('mkdirp');

class TeacherService extends Service {
  // 创建老师
  async create(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
    const result = await ctx.model.Teacher.findOne({ User: user });
    if (result) { return [ -2, '你已经申请过当家教了' ]; }
    const teacher = await ctx.model.Teacher.aggregate().sort({ id: -1 });
    const newTeacher = new ctx.model.Teacher({
      User: user,
      experience: params.experience,
      realName: params.realName,
      age: params.age,
      hourPrice: params.hourPrice,
      goodAt: params.goodAt,
      city: params.city,
      school: params.school,
      createTime: Math.round(new Date() / 1000),
    });
    if (!teacher.length) {
      newTeacher.id = 'T' + new Date().getFullYear().toString()
        .substr(2, 2) + '01';
      newTeacher.save();
      user.type = 1;
      user.save();
      return [ 0, `${user.nickName} 申请做家教成功，请等待管理员审核`, results[1], results[2] ];
    }
    const Id = Number(teacher[0].id.substr(1));
    newTeacher.id = `T${Id + 1}`;
    newTeacher.save();
    return [ 0, `${user.nickName} 申请做家教成功，请等待管理员审核`, results[1], results[2] ];
  }
  // 查看教师个人信息
  async information() {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
    const teacherResult = await ctx.model.Teacher.findOne({ User: user }).populate({ path: 'User', select: { _id: 0, password: 0, id: 0 } });
    if (!teacherResult) { return [ 400502, '你尚未申请做家教，请前往申请' ]; }
    return [ 0, `${user.nickName}个人信息返回成功`, teacherResult, results[1], results[2] ];
  }
  // 修改家教个人信息
  async modify(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
    const teacher = await ctx.model.Teacher.findOne({ User: user });
    if (!teacher) { return [ 400503, '你尚未申请做家教，请前往申请' ]; }
    const checkParams = [ 'experience', 'age', 'goodAt', 'hourPrice', 'city' ];
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
    if (!newData.size) { return [ 400503, '没有进行任何修改' ]; }
    const obj = Object.create(null);
    for (const [ k, v ] of newData) {
      obj[k] = v;
    }
    obj.state = 1;
    obj.updateTime = Math.round(new Date() / 1000);
    await this.ctx.model.Teacher.updateOne({ User: user }, obj);
    return [ 0, `${user.nickName} 家教个人信息修改成功`, results[1], results[2] ];
  }
  // 管理员审核通过
  async agree(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const admin = await ctx.model.Admin.findOne({ name: results[3] });
    if (!admin) { return [ -1, `不存在管理员${results[3]}` ]; }
    const teacher = await ctx.model.Teacher.findOne({ id: params.id, state: 1 }).populate({ path: 'User', select: 'nickName' }).ne('status', 0);
    if (!teacher) { return [ 404402, '不存在该老师，参数异常' ]; }
    await this.ctx.model.Teacher.updateOne({ id: teacher.id }, { state: 3 });
    return [ 0, `${teacher.User.nickName}审核通过`, results[1], results[2] ];
  }
  // 管理员审核不通过
  async disagree(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const admin = await ctx.model.Admin.findOne({ name: results[3] });
    if (!admin) { return [ -1, `不存在管理员${results[3]}` ]; }
    const teacher = await ctx.model.Teacher.findOne({ id: params.id, state: 1 }).populate({ path: 'User', select: 'nickName' }).ne('status', 0);
    if (!teacher) { return [ 404403, '不存在该老师，参数异常' ]; }
    await this.ctx.model.Teacher.updateOne({ id: teacher.id }, { state: 2 });
    return [ 0, `${teacher.User.nickName}审核不通过`, results[1], results[2] ];
  }
  // 用户查看教师个人信息
  async informationOfUser(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
    const teacherResult = await ctx.model.Teacher.findOne({ id: params.id }).populate({ path: 'User', select: { _id: 0, password: 0, id: 0 } });
    if (!teacherResult) { return [ 400502, '尚无此老师信息' ]; }
    return [ 0, `${teacherResult.User.nickName}个人信息返回成功`, teacherResult, results[1], results[2] ];
  }
  // 所有教师信息列表
  async ListOfUser(page) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const { pageSize } = this.config.paginatorConfig;
    const total = await this.ctx.model.Teacher.find({ state: 3 }).count();
    if (!total) { return [ 404404, '暂无教师信息' ]; }
    const totals = Math.ceil(total / pageSize);
    if (page > totals) { return [ -2, '无效页码' ]; }
    if (page < 1) { page = 1; }
    const result = await this.ctx.model.Teacher.find({ state: 3 }).skip((page - 1) * pageSize)
      .limit(pageSize);
    if (!Number(page)) {
      page = 1;
    } else {
      page = Number(page);
    }
    return [ 0, '所有教师信息返回成功', result, totals, page, results[1], results[2] ];
  }
  // 搜索老师
  async search(params, page) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const { pageSize } = this.config.paginatorConfig;
    let total = null;
    if (params.name === null) {
      total = await this.ctx.model.Teacher.find({ state: 3 }).countDocuments();
      if (!total) { return [ 404404, '暂无教师信息' ]; }
    } else {
      total = await this.ctx.model.Teacher.find({ goodAt: { $regex: params.name } , state: 3 }).countDocuments();
      if (!total) { return [ 404404, '暂无教师信息' ]; }
    }
    const totals = Math.ceil(total / pageSize);
    if (page > totals) { return [ -2, '无效页码' ]; }
    if (page < 1) { page = 1; }
    let result = null;
    if (params.name === null) {
      result = await this.ctx.model.Teacher.find({ state: 3 }).skip((page - 1) * pageSize).limit(pageSize);
    } else {
      result = await this.ctx.model.Teacher.find({ goodAt: { $regex: params.name } , state: 3 }).skip((page - 1) * pageSize).limit(pageSize);
    }
    if (!Number(page)) {
      page = 1;
    } else {
      page = Number(page);
    }
    return [ 0, '符合条件的所有教师信息返回成功', result, totals, page, results[1], results[2] ];
  }
  // 所有教师信息列表
  async list(page) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const { pageSize } = this.config.paginatorConfig;
    const total = await this.ctx.model.Teacher.find({}).count();
    if (!total) { return [ 404404, '暂无教师信息' ]; }
    const totals = Math.ceil(total / pageSize);
    if (page > totals) { return [ -2, '无效页码' ]; }
    if (page < 1) { page = 1; }
    const result = await this.ctx.model.Teacher.find({}).populate({ path: 'User', select: { _id: 0, password: 0, id: 0 } }).sort({ totalSuccess: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    if (!Number(page)) {
      page = 1;
    } else {
      page = Number(page);
    }
    return [ 0, '所有教师信息返回成功', result, totals, page, results[1], results[2] ];
  }
  // 首页教师信息列表
  async listOfRecommend() {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const result = await this.ctx.model.Teacher.find({ state: 3 }).populate({ path: 'User', select: { _id: 0, password: 0, id: 0 } }).sort({ totalSuccess: -1 })
      .limit(10);
    if (!result) { return [ 404404, '暂无教师信息' ]; }
    return [ 0, '所有教师信息返回成功', result, results[1], results[2] ];
  }
  // 上传身份证正面照
  async identityCard1(filename) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '用户不存在' ]; }
    const teacher = await ctx.model.Teacher.findOne({ User: user });
    if (!teacher) { return [ 400503, '你尚未申请做家教，请前往申请' ]; }
    const day = sd.format(new Date(), 'YYYYMMDD');// 获取当前日期
    const dir = path.join(this.config.uploadDir, day);// 创建图片保存的路径
    await mkdirp(dir);// 不存在就创建目录
    const date = Date.now();// 毫秒数
    const uploadDir = path.join(dir, date + path.extname(filename));
    const saveDir = this.ctx.origin + uploadDir.slice(3).replace(/\\/g, '/');
    await this.ctx.model.Teacher.updateOne({ id: teacher.id }, { identityCard1: saveDir });
    return { uploadDir, saveDir };
  }
  // 上传身份证反面照
  async identityCard2(filename) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '用户不存在' ]; }
    const teacher = await ctx.model.Teacher.findOne({ User: user });
    if (!teacher) { return [ 400503, '你尚未申请做家教，请前往申请' ]; }
    const day = sd.format(new Date(), 'YYYYMMDD');// 获取当前日期
    const dir = path.join(this.config.uploadDir, day);// 创建图片保存的路径
    await mkdirp(dir);// 不存在就创建目录
    const date = Date.now();// 毫秒数
    const uploadDir = path.join(dir, date + path.extname(filename));
    const saveDir = this.ctx.origin + uploadDir.slice(3).replace(/\\/g, '/');
    await this.ctx.model.Teacher.updateOne({ id: teacher.id }, { identityCard2: saveDir });
    return { uploadDir, saveDir };
  }
}
module.exports = TeacherService;
