/**
 * @author: Chen yt7
 * @date: 2020/12/12 3:30 PM
 * @CompletionDate：2020/01/26 2:30PM
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
    if (!params.name) { return [ 404101, '参数异常' ]; }
    const newCategory = new ctx.model.Category({ createTime: Math.round(new Date() / 1000) });
    if (params.parentId) {
      const checkId = await ctx.model.Category.findOne({ id: params.parentId }).ne('deleted', 0);
      if (!checkId) { return [ 404101, '不存在父级id' ]; }
      newCategory.parentId = params.parentId;
      newCategory.name = checkId.name + params.name;
    } else {
      newCategory.name = params.name;
    }
    if (!category.length) {
      newCategory.id = 1;
      newCategory.save();
      return [ 0, `${newCategory.name} 创建成功`, results[1], results[2] ];
    }
    newCategory.id = category[0].id + 1;
    newCategory.save();
    return [ 0, `${newCategory.name} 创建成功`, results[1], results[2] ];
  }
  // 删除科目类
  async del(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const admin = await ctx.model.Admin.findOne({ name: results[3] });
    if (!admin) { return [ -1, `不存在管理员${results[3]}` ]; }
    const category = await ctx.model.Category.findOne({ id: params.id }).ne('deleted', 0);
    if (!category) { return [ 404103, '分类不存在' ]; }
    const checkName = await ctx.model.Category.findOne({ parentId: params.id }).ne('deleted', 0);
    if (checkName) { return [ 404103, '该分类为父级分类，尚存在子分类，请先删除子分类' ]; }
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
    if (!total) { return [ 404104, '暂无科目信息' ]; }
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
  // Admin后台查看所有科目
  async listOfAdmin() {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const result = await this.ctx.model.Category.aggregate([{
      $lookup: {
        from: 'categories',
        localField: 'id',
        foreignField: 'parentId',
        as: 'category_list',
      },
    }]);
    if (!result) { return [ 404105, '暂无分类信息' ]; }
    return [ 0, '所有科目信息返回成功', result, results[1], results[2] ];
  }
  // user查看所有科目
  async listOfUser() {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const result = await this.ctx.model.Category.find({}).ne('deleted', '0')
    if (!result) { return [ 404105, '暂无分类信息' ]; }
    return [ 0, '所有科目信息返回成功', result, results[1], results[2] ];
  }
}
module.exports = CategoryService;
