/**
 * @author: Chen yt7
 * @date: 2020/12/24 3:30 PM
 */
'use strict';

const Service = require('egg').Service;
const md5 = require('js-md5');
const jwt = require('../utils/jwt');
const { ERROR, SUCCESS } = require('../utils/restful');

class CommentService extends Service {
  // 生成评论
  async generate(params) {
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
      const Need = await ctx.model.Need.findOne({ id: params.id }).ne('status', 0);
      if (!Need) {
        return Object.assign(ERROR, { msg: '查无此需求' });
      }
      const Appoint = await ctx.model.Appoint.findOne({ need: Need }).populate('Teacher').ne('status', 0);
      if (!Appoint) {
        return Object.assign(ERROR, { msg: '查无此预约' });
      }
      const comment = await ctx.model.Comment.create({
        id: md5(Date.now().toString(36)),
        formId: user.id,
        toId: Appoint.teacher,
        need: Need,
        appoint: Appoint,
        content: params.content,
        type: params.type,
        rank: params.rank,
        createTime: Math.round(new Date() / 1000),
      });
      comment.save();
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '评论成功' });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 查看评论
  async see(params) {
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
      const result = await ctx.model.Comment.findOne({ id: params.id }).ne('status', 0);
      if (!result) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '查无此评论' });
      }
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '评论信息返回成功', result });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 评论列表
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
      const total = await this.ctx.model.Comment.find({ formId: user.id }).ne('status', 0).count();
      if (!total) {
        ctx.status = 401;
        return Object.assign(ERROR, { msg: '暂无评论信息' });
      }
      const totals = Math.ceil(total / pageSize);
      if (page > totals) { return [ -2, '无效页码' ]; }
      if (page < 1) { page = 1; }
      const commentResult = await this.ctx.model.Comment.find({ formId: user.id }).ne('status', 0).skip((page - 1) * pageSize)
        .limit(pageSize);
      if (!Number(page)) {
        page = 1;
      } else {
        page = Number(page);
      }
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '所有预约信息返回成功', commentResult, totals, page });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
}
module.exports = CommentService;
