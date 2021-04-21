/**
 * @author: Chen yt7
 * @date: 2020/12/15 2:30PM
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AppointSchema = new Schema({
    id: { type: String, allowNull: false }, // 预约id
    student: { type: Schema.Types.ObjectId, ref: 'User' }, // 家长id
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' }, // 老师id
    state: { type: Number, default: 0 }, // 状态 0未预约 1已预约 2进行中 3已完成 4已关闭
    frequency: { type: Number, default: 0 }, // 总共几次
    timeHour: { type: Number, default: 0 }, // 每次几小时
    teach_date: { type: String, default: null }, // 上课时间
    hourPrice: { type: Number, default: 0 }, // 每小时几元
    totalPrice: { type: Number, default: 0 }, // 老师报价
    name: { type: String, default: null }, // 学生称呼
    phone: { type: String, default: null }, // 联系方式
    qq: { type: String, default: null }, // QQ
    wechat: { type: String, default: null }, // 微信
    city: { type: Array, default: null }, // 城市
    address: { type: String, default: null }, // 详情地址
    subject: { type: String, default: null }, // 科目
    content: { type: String, default: null }, // 评论
    rate: { type: Number }, // 评分
    createTime: { type: Number, default: null }, // 创建时间
    updateTime: { type: Number, default: null }, // 更新时间
  });

  return mongoose.model('Appoint', AppointSchema);
};
