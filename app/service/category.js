/**
 * @author: Chen yt7
 * @date: 2020/12/12 3:30 PM
 * @modifyDate：2020/12/20 9：00PM
 */
'use strict';

const Service = require('egg').Service;
const jwt = require('../utils/jwt');

class CategoryService extends Service {
  // 创建科目类
  async create(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) if (results[0]) { return [ -3, '请求失败' ]; }
    const admin = await ctx.model.Admin.findOne({ name: results[3] });
    if (!admin) { return [ -1, `不存在管理员${results[3]}` ]; }
    const category = await ctx.model.Category.aggregate().sort({ id: -1 });
    if (!params.name) { return [ -2, '参数异常' ]; }
    const newCategory = new ctx.model.Category({
      createTime: Math.round(new Date() / 1000),
      parentId: params.parentId,
      name: params.name,
    });
    if (!category.length) {
      newCategory.id = 1;
      newCategory.save();
      return [ 0, `${newCategory.name} 创建成功`, results[1], results[2] ];
    }
    newCategory.id = category[0].id + 1;
    newCategory.save();
    return [ 0, `${newCategory.name} 创建成功`, results[1], results[2] ];
  }
  // 修改科目类
  async modify(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const admin = await ctx.model.Admin.findOne({ name: results[3] });
    if (!admin) { return [ -1, `不存在管理员${results[3]}` ]; }
    const category = await ctx.model.Category.findOne({ id: params.id }).ne('deleted', 0);
    if (!category) { return [ -1, '分类名不存在' ]; }
    const checkParams = [ 'name', 'parentId' ];
    const newData = new Map();
    const paramsMap = new Map(Object.entries(params));
    const newCategory = new Map(Object.entries(category.toObject()));
    for (const k of paramsMap.keys()) {
      if (params[k] !== newCategory.get(k)) {
        if (!checkParams.includes(k)) { continue; }
        if (!params[k]) { continue; }
        newData.set(k, params[k]);
      }
    }
    if (!newData.size) { return [ -1, '没有进行任何修改' ]; }
    const obj = Object.create(null);
    for (const [ k, v ] of newData) {
      obj[k] = v;
    }
    obj.updateTime = Math.round(new Date() / 1000);
    await this.ctx.model.Category.updateOne({ id: params.id }, obj);
    return [ 0, '该分类信息修改成功', results[1], results[2] ];
  }
  // 删除科目类
  async del(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const admin = await ctx.model.Admin.findOne({ name: results[3] });
    if (!admin) { return [ -1, `不存在管理员${results[3]}` ]; }
    const category = await ctx.model.Category.findOne({ id: params.id }).ne('deleted', 0);
    if (!category) { return [ -1, '分类名不存在' ]; }
    const checkName = await ctx.model.Category.findOne({ parentId: params.id }).ne('deleted', 0);
    if (checkName) { return [ -1, '该分类为父级分类，尚存在子分类，请先删除子分类' ]; }
    await this.ctx.model.Category.updateOne({ id: params.id }, { deleted: 0 });
    return [ 0, '该分类信息删除成功', results[1], results[2] ];
  }
  // 查看所有科目
  async list(page) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const { pageSize } = this.config.paginatorConfig;
    const total = await this.ctx.model.Category.find({}).ne('deleted', '0').count();
    if (!total) { return [ -3, '暂无科目信息' ]; }
    const totals = Math.ceil(total / pageSize);
    if (page > totals) { return [ -2, '无效页码' ]; }
    if (page < 1) { page = 1; }
    const result = await this.ctx.model.Category.find({}).ne('deleted', '0').skip((page - 1) * pageSize)
      .limit(pageSize);
    if (!Number(page)) {
      page = 1;
    } else {
      page = Number(page);
    }
    return [ 0, '所有科目信息返回成功', result, totals, page, results[1], results[2] ];
  }
}
module.exports = CategoryService;
