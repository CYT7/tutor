/**
 * @author: Chen yt7
 * @date: 2020/12/12 3:30 PM
 */
'use strict';

const Service = require('egg').Service;
const { ERROR, SUCCESS } = require('../utils/restful');

class CategoryService extends Service {
  // 创建科目类
  async create(params) {
    const { ctx } = this;
    try {
      const check = await ctx.model.Category.findOne({ name: params.name });
      if (check) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '分类名已经存在' });
      }
      const category = await ctx.model.Category.aggregate().sort({ id: -1 });
      const newCategory = new ctx.model.Category({
        createTime: Math.round(new Date() / 1000),
        parentId: params.parentId,
        name: params.name,
      });
      if (!category.length) {
        newCategory.id = 1;
        newCategory.save();
        ctx.status = 201;
        return Object.assign(SUCCESS, { msg: `${newCategory.name} 创建成功` });
      }
      newCategory.id = category[0].id + 1;
      newCategory.save();
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `${newCategory.name} 创建成功` });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 修改科目类
  async modify(params) {
    const { ctx } = this;
    try {
      const category = await ctx.model.Category.findOne({ id: params.id }).ne('deleted', 0);
      if (!category) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '分类名不存在' });
      }
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
      if (!newData.size) { return Object.assign(ERROR, { msg: '没有进行任何修改' }); }
      const obj = Object.create(null);
      for (const [ k, v ] of newData) {
        obj[k] = v;
      }
      obj.updateTime = Math.round(new Date() / 1000);
      await this.ctx.model.Category.updateOne({ id: params.id }, obj);
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '该分类信息修改成功' });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 删除科目类
  async del(params) {
    const { ctx } = this;
    try {
      const category = await ctx.model.Category.findOne({ id: params.id }).ne('deleted', 0);
      if (!category) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '分类名不存在' });
      }
      const checkName = await ctx.model.Category.findOne({ parentId: params.id }).ne('deleted', 0);
      if (checkName) {
        return Object.assign(ERROR, { msg: '该分类为父级分类，尚存在子分类，请先删除子分类' });
      }
      await this.ctx.model.Category.updateOne({ id: params.id }, { deleted: 0 });
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '该分类信息删除成功' });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 查看所有科目
  async list(page) {
    const { ctx } = this;
    try {
      const { pageSize } = this.config.paginatorConfig;
      const total = await this.ctx.model.Category.find({}).ne('deleted', '0').count();
      if (!total) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: '暂无科目信息' });
      }
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
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '所有科目信息返回成功', data: result, totals, page });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
}
module.exports = CategoryService;
