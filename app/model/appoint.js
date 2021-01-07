/**
 * @author: Chen yt7
 * @date: 2020/12/15 2:30PM
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AppointSchema = new Schema({
    id: { type: String },
    student: { type: Schema.Types.ObjectId, ref: 'User' }, // 家长id
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' }, // 老师id
    state: { type: Number, default: 0 }, // 状态 0未预约 1已预约 待付款 2进行中 3已完成 4已关闭
    status: { type: Number, default: 1 }, // 状态 0禁用 1启用
    frequency: { type: Number, default: 0 }, // 总共几次
    timeHour: { type: Number, default: 0 }, // 每次几小时
    teach_date: { type: String, default: null }, // 上课时间
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
