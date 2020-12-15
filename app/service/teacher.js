/**
 * @author: Chen yt7
 * @date: 2020/12/15 1:03 PM
 */
'use strict';

const Service = require('egg').Service;
const md5 = require('js-md5');
const { ERROR, SUCCESS } = require('../utils/restful');

class TeacherService extends Service {
  // 创建老师
  async create(params) {
    const { ctx } = this;
    try {
      const check = await ctx.model.User.findOne({ $or: [{ phone: params.phone }, { email: params.email }] }).ne('status', 0);
      if (!check) {
        ctx.status = 400;
        return Object.assign(ERROR, { msg: '查无此账号，请前往创建或者联系管理员' });
      }
      const teacher = await ctx.model.Teacher.aggregate().sort({ id: -1 });
      const newTeacher = new ctx.model.Teacher({
        experience: params.experience,
        age: params.age,
        hourPrice: params.hourPrice,
        createTime: Math.round(new Date() / 1000),
      });
      if (!teacher.length) {
        newTeacher.id = 'T' + new Date().getFullYear().toString()
          .substr(2, 2) + '01';
        newTeacher.save();
        ctx.status = 201;
        return Object.assign(SUCCESS, { msg: `${check.nickName} 申请做家教成功，请等待管理员审核` });
      }
      const Id = Number(teacher[0].id.substr(1));
      newTeacher.id = `T${Id + 1}`;
      newTeacher.save();
      ctx.status = 201;
      return Object.assign(SUCCESS, { msg: `${check.nickName} 申请做家教成功，请等待管理员审核` });
    } catch (error) {
      ctx.status = 500;
      throw (error);
    }
  }

}
module.exports = TeacherService;
