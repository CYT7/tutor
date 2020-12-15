/**
 * @author: Chen yt7
 * @date: 2020/12/15 2:30PM
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AppointSchema = new Schema({
    id: Number,
    need: { type: Schema.Types.ObjectId, ref: 'Need' }, // 需求id
    student: { type: Schema.Types.ObjectId, ref: 'User' }, // 家长id
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' }, // 老师id
    tradeNo: { type: Number, default: 0 }, // 订单号
    studentComment: { type: Number, default: 0 }, // 学生是否已评论 0未评论 1已评论
    teacherComment: { type: Number, default: 0 }, // 老师是否已评论 0未评论 1已评论
    studentDelete: { type: Number, default: 0 }, // 学生是否已软删除 0未删除 1已删除
    teacherDelete: { type: Number, default: 0 }, // 老师是否已软删除 0未删除 1已删除
    state: { type: Number, default: 0 }, // 状态 1已预约 2待付款 已中标 3进行中 4待结课 5待关闭 6待评论 7已完成 8已关闭
    reason: { type: String, default: null }, // 关闭原因
    status: { type: Number, default: 1 }, // 状态 0禁用 1启用
    frequency: { type: Number, default: 0 }, // 总共几次
    timeHour: { type: Number, default: 0 }, // 每次几小时
    hourPrice: { type: Number, default: 0 }, // 每小时几元
    totalPrice: { type: Number, default: 0 }, // 老师报价
    name: { type: String, default: null }, // 学生称呼
    phone: { type: String, default: null }, // 联系方式
    qq: { type: String, default: null }, // QQ
    wechat: { type: String, default: null }, // 微信
    address: { type: String, default: null }, // 地址
    subject: { type: String, default: null }, // 科目
    sort: { type: Number, default: 0 }, // 排序
    createTime: { type: Number, default: null }, // 创建时间
    updateTime: { type: Number, default: null }, // 更新时间

  });

  return mongoose.model('Appoint', AppointSchema);
};
