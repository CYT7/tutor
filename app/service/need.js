/**
 * @author: Chen yt7
 * @date: 2020/12/21 3:15 PM
 * @CompletionDate：2021/02/06 1:15PM
 */
'use strict';
const Service = require('egg').Service;
const jwt = require('../utils/jwt');
class NeedService extends Service {
  // 创建需求
  async create(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ _id: results[3] });
    if (!user) { return [ -2, '不存在用户' ]; }
    const need = await ctx.model.Need.create({
      id: 'N' + new Date().getTime(),
      User: user,
      nickName: params.nickName,
      phone: params.phone,
      wechat: params.wechat,
      qq: params.qq,
      gender: params.gender,
      teacherGender: params.teacherGender,
      city: params.city,
      address: params.address,
      teach_date: params.teach_date.join(','),
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
  // 查看需求信息
  async information(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const need = await ctx.model.Need.findOne({ id: params.id });
    if (!need) { return [ 400602, '查无此需求' ]; }
    return [ 0, `${need.id} 返回信息成功`, need, results[1], results[2] ];
  }
  // 查看需求信息
  async application(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const need = await ctx.model.Need.findOne({ id: params.id, state: 3 });
    if (!need) { return [ 400603, '查无此需求' ]; }
    const result = await ctx.model.Application.find({ Need: need }).populate({ path: 'Teacher', select: { _id: 0, User: 0 } });
    if (!result) { return [ 400603, '暂无老师应聘' ]; }
    return [ 0, '返回应聘者信息成功', result, results[1], results[2] ];
  }
  // 需求已选定老师
  async confirm(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ _id: results[3] });
    if (!user) { return [ -2, '非法用户' ]; }
    const application = await ctx.model.Application.findOne({ _id: params._id });
    if (!application) { return [ 400604, '应聘数据异常，请稍后再试' ]; }
    const need = await ctx.model.Need.findOne({ _id: application.Need });
    if (!need) { return [ 400604, '查无此需求' ]; }
    const Teacher = await ctx.model.Teacher.findOne({ _id: application.Teacher });
    if (!Teacher) { return [ 400604, '查无此老师' ]; }
    await this.ctx.model.Need.updateOne({ id: need.id }, { state: 4, teacher: Teacher, updateTime: Math.round(new Date() / 1000) });
    return [ 0, '此需求选定老师成功', results[1], results[2] ];
  }
  // 需求已完成
  async finish(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ _id: results[3] });
    if (!user) { return [ -2, '非法用户' ]; }
    const need = await ctx.model.Need.findOne({ id: params.id, state: 4 });
    if (!need) { return [ 400605, '查无此需求' ]; }
    const needPrice = need.totalPrice;
    if (user.balance < needPrice) { return [ 400605, '余额不足，需求无法完成，请充值' ]; }
    console.log(user.balance);
    user.save();
    need.content = params.content;
    need.rate = params.rate;
    need.save();
    const teacher = await ctx.model.Teacher.findOne({ _id: need.teacher }).populate({ path: 'User', select: 'balance' });
    teacher.User.balance = teacher.User.balance + needPrice;
    teacher.User.save();
    teacher.totalSuccess = teacher.totalSuccess + 1;
    teacher.totalComment = teacher.totalComment + 1;
    if (teacher.totalComment === 1) {
      teacher.satisfaction = (Number(params.rate) + Number(teacher.satisfaction)) / teacher.totalComment;
    } else {
      teacher.satisfaction = (Number(params.rate) + Number(teacher.satisfaction)) / 2;
    }
    teacher.save();
    await this.ctx.model.Need.updateOne({ id: need.id }, { state: 5, updateTime: Math.round(new Date() / 1000) });
    return [ 0, '此需求完成了', results[1], results[2] ];
  }
  // 关闭需求
  async userClose(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ _id: results[3] });
    if (!user) { return [ -2, '非法用户' ]; }
    const need = await ctx.model.Need.findOne({ id: params.id }).ne('state', 6);
    if (!need) { return [ 400606, '查无此需求' ]; }
    if (need.state !== 5) {
      need.state = 6;
      need.updateTime = Math.round(new Date() / 1000);
      need.save();
      return [ 0, '需求关闭成功', results[1], results[2] ];
    }
    return [ 400606, '需求关闭异常，请稍后再试' ];
  }
  // 关闭需求
  async teacherClose(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const teacher = await ctx.model.Teacher.findOne({ User: results[3] });
    if (!teacher) { return [ -2, '你不是老师' ]; }
    const need = await ctx.model.Need.findOne({ id: params.id }).ne('state', 6);
    if (!need) { return [ 400606, '查无此需求' ]; }
    if (need.state !== 5) {
      need.state = 6;
      need.updateTime = Math.round(new Date() / 1000);
      need.save();
      return [ 0, '需求关闭成功', results[1], results[2] ];
    }
    return [ 400606, '需求关闭异常，请稍后再试' ];
  }
  // 用户查看所有推荐需求信息
  async list() {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const NeedResult = await this.ctx.model.Need.find({ state: 3 }).ne('User', results[3]).sort({ totalPrice: -1, hourPrice: -1, createTime: -1 })
      .limit(6);
    if (!NeedResult) { return [ 400607, '暂无需求信息' ]; }
    return [ 0, '所有需求信息返回成功', NeedResult, results[1], results[2] ];
  }
  // 用户查看自已的所有需求信息
  async Userlist(page) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ _id: results[3] });
    if (!user) { return [ -2, '非法用户' ]; }
    const { pageSize } = this.config.paginatorConfig;
    const total = await this.ctx.model.Need.find({ User: user }).countDocuments();
    if (!total) { return [ 400608, '暂无需求信息' ]; }
    const totals = Math.ceil(total / pageSize);
    if (page > totals) { return [ -2, '无效页码' ]; }
    if (page < 1) { page = 1; }
    const NeedResult = await this.ctx.model.Need.find({ User: user }).sort({ createTime: -1, state: -1, updateTime: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    if (!Number(page)) {
      page = 1;
    } else {
      page = Number(page);
    }
    return [ 0, '所有需求信息返回成功', NeedResult, totals, page, results[1], results[2] ];
  }
  // 用户查看所有需求信息
  async List(page) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const { pageSize } = this.config.paginatorConfig;
    const total = await this.ctx.model.Need.find({ state: 3 }).ne('User', results[3]).countDocuments();
    if (!total) { return [ 400608, '暂无需求信息' ]; }
    const totals = Math.ceil(total / pageSize);
    if (page > totals) { return [ -2, '无效页码' ]; }
    if (page < 1) { page = 1; }
    const NeedResult = await this.ctx.model.Need.find({ state: 3 }).ne('User', results[3]).skip((page - 1) * pageSize)
      .limit(pageSize);
    if (!Number(page)) {
      page = 1;
    } else {
      page = Number(page);
    }
    return [ 0, '所有需求信息返回成功', NeedResult, totals, page, results[1], results[2] ];
  }
  // 用户符合条件需求信息列表
  async search(params, page) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const { pageSize } = this.config.paginatorConfig;
    let total = null;
    if (params.name === null) {
      total = await this.ctx.model.Need.find({ state: 3 }).ne('User', results[3]).countDocuments();
      if (!total) { return [ 400607, '暂无需求信息' ]; }
    } else {
      total = await this.ctx.model.Need.find({ subject: { $regex: params.name }, state: 3 }).ne('User', results[3]).countDocuments();
      if (!total) { return [ 400607, '暂无需求信息' ]; }
    }
    const totals = Math.ceil(total / pageSize);
    if (page > totals) { return [ -2, '无效页码' ]; }
    if (page < 1) { page = 1; }
    let NeedResult = null;
    if (params.name === null) {
      NeedResult = await this.ctx.model.Need.find({ state: 3 }).ne('User', results[3]).skip((page - 1) * pageSize)
        .limit(pageSize);
    } else {
      NeedResult = await this.ctx.model.Need.find({ subject: { $regex: params.name }, state: 3 }).ne('User', results[3]).skip((page - 1) * pageSize)
        .limit(pageSize);
    }
    if (!Number(page)) {
      page = 1;
    } else {
      page = Number(page);
    }
    return [ 0, '所有需求信息返回成功', NeedResult, totals, page, results[1], results[2] ];
  }
  // 申请需求(老师申请执教）
  async apply(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const teacher = await this.ctx.model.Teacher.findOne({ User: results[3] });
    if (!teacher) { return [ 400601, 'sorry，你暂无执教资格，请前往申请' ]; }
    const need = await ctx.model.Need.findOne({ id: params.id, state: 3 });
    if (!need) { return [ 400601, 'sorry,查无此需求' ]; }
    const find = await ctx.model.Application.findOne({ Need: need, Teacher: teacher });
    if (find) { return [ 400601, '你已经应聘了' ]; }
    const newApplication = new ctx.model.Application({
      Need: need,
      Teacher: teacher,
      createTime: Math.round(new Date() / 1000),
    });
    newApplication.save();
    if (teacher.id === need.appoint) { return [ 400601, '你已经申请了' ]; }
    need.appoint = teacher.id;
    need.updateTime = Math.round(new Date() / 1000);
    need.save();
    return [ 0, '该需求你申请成功，请等家长选择', results[1], results[2] ];
  }
  // 所有需求信息
  async Teacherlist(page) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const Teacher = await ctx.model.Teacher.findOne({ User: results[3] });
    if (!Teacher) { return [ -2, '你尚未申请做家教，请前往申请' ]; }
    const { pageSize } = this.config.paginatorConfig;
    const total = await this.ctx.model.Need.find({ teacher: Teacher }).countDocuments();
    if (!total) { return [ 400607, '暂无需求信息' ]; }
    const totals = Math.ceil(total / pageSize);
    if (page > totals) { return [ -2, '无效页码' ]; }
    if (page < 1) { page = 1; }
    const NeedResult = await this.ctx.model.Need.find({ teacher: Teacher }).sort({ updateTime: -1, createTime: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    if (!Number(page)) {
      page = 1;
    } else {
      page = Number(page);
    }
    return [ 0, '所有需求信息返回成功', NeedResult, totals, page, results[1], results[2] ];
  }
  // 审核需求 - 通过
  async agree(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const admin = await ctx.model.Admin.findOne({ name: results[3] });
    if (!admin) { return [ -1, '非法管理员' ]; }
    const need = await ctx.model.Need.findOne({ id: params.id, state: 1 });
    if (!need) { return [ 404401, '查无此需求' ]; }
    await this.ctx.model.Need.updateOne({ id: need.id }, { state: 3, updateTime: Math.round(new Date() / 1000) });
    return [ 0, '此需求审核通过', results[1], results[2] ];
  }
  // 审核需求 - 不通过
  async disagree(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const admin = await ctx.model.Admin.findOne({ name: results[3] });
    if (!admin) { return [ -1, '非法管理员' ]; }
    const need = await ctx.model.Need.findOne({ id: params.id, state: 1 });
    if (!need) { return [ 404402, '查无此需求' ]; }
    await this.ctx.model.Need.updateOne({ id: need.id }, { state: 2, updateTime: Math.round(new Date() / 1000)  });
    return [ 0, '此需求审核不通过', results[1], results[2] ];
  }
  // 修改需求(审核不通过)
  async modify(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ _id: results[3] });
    if (!user) { return [ -2, '不存在用户' ]; }
    const need = await ctx.model.Need.findOne({ id: params.id, state: 2 });
    if (!need) { return [ 400607, '查无此需求' ]; }
    const checkParams = [ 'nickName', 'phone', 'qq', 'wechat', 'gender', 'teacherGender', 'city', 'address', 'subject', 'frequency', 'timeHour', 'hourPrice' ];
    const newData = new Map();
    const paramsMap = new Map(Object.entries(params));
    const newUser = new Map(Object.entries(need.toObject()));
    for (const k of paramsMap.keys()) {
      if (params[k] !== newUser.get(k)) {
        if (!checkParams.includes(k)) { continue; }
        if (!params[k]) { continue; }
        newData.set(k, params[k]);
      }
    }
    if (!newData.size) { return [ 400607, '没有进行任何修改' ]; }
    const obj = Object.create(null);
    for (const [ k, v ] of newData) {
      obj[k] = v;
    }
    obj.teach_date = params.teach_date.join(',');
    obj.updateTime = Math.round(new Date() / 1000);
    obj.totalPrice = params.frequency * params.timeHour * params.hourPrice;
    obj.state = 1;
    await this.ctx.model.Need.updateOne({ id: need.id }, obj);
    return [ 0, '需求信息修改成功', results[1], results[2] ];
  }
  // 所有需求信息
  async adminList(page, types) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const { pageSize } = this.config.paginatorConfig;
    const typesResults = [];
    if (types) {
      // eslint-disable-next-line no-unused-vars
      types.forEach((data, index, array) => {
        console.log(data);
        typesResults.push(+data);
      });
      typesResults.sort();

    }
    let total = null;
    if (types) {
      total = await this.ctx.model.Need.find({ state: { $in: typesResults } }).countDocuments();
      if (!total) { return [ 404403, '暂无需求信息' ]; }
    } else {
      total = await this.ctx.model.Need.find({}).countDocuments();
      if (!total) { return [ 404403, '暂无需求信息' ]; }
    }
    const totals = Math.ceil(total / pageSize);
    if (page > totals) { return [ -2, '无效页码' ]; }
    if (page < 1) { page = 1; }
    let NeedResult = null;
    if (types) {
      NeedResult = await this.ctx.model.Need.find({ state: { $in: typesResults } }).sort({ createTime: -1, updateTime: -1 }).skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate('User', 'nickName')
        .exec();
    } else {
      NeedResult = await this.ctx.model.Need.find({}).sort({ createTime: -1, updateTime: -1 }).skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec();
    }
    if (!Number(page)) {
      page = 1;
    } else {
      page = Number(page);
    }
    return [ 0, '所有需求信息返回成功', NeedResult, totals, page, results[1], results[2] ];
  }
}
module.exports = NeedService;
