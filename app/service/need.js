/**
 * @author: Chen yt7
 * @date: 2020/12/16 2:00 PM
 */
'use strict';

const Service = require('egg').Service;
const md5 = require('js-md5');
const { ERROR, SUCCESS } = require('../utils/restful');

class NeedService extends Service {
  async create(params) {
    const { ctx } = this;
    try {
      const user = await ctx.model.User.findOne({ $or: [{ phone: params.phone }, { email: params.email }] }).ne('status', 0);
      if (!user) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '参数异常' });
      }
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
        createTime: Math.round(new Date() / 1000),
      });
      need.totalPrice = need.frequency * need.timeHour * need.hourPrice;
      need.save();
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: '需求创建成功，待管理员审核' });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }
  // 查看需求信息
  async information(params) {

  }
}
module.exports = NeedService;
