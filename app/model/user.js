/**
 * @author: Chen yt7
 * @date: 2020/12/13 4:05 PM
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AdminSchema = new Schema({
    id: Number,
    nickName: String, // 昵称
    realName: { type: String, default: null }, // 真实姓名
    phone: { type: String, default: null }, // 联系方式
    email: { type: String, default: null }, // 邮箱
    password: String, // 密码
    qq: { type: String, default: null }, // QQ
    wechat: { type: String, default: null }, // 微信号
    address: { type: String, default: null }, // 地址
    balance: { type: Number, default: 0.00 }, // 余额
    gender: { type: Number, default: 0 }, // 性别 0 未知，1男 2女
    status: { type: Number, default: 1 }, // 状态 1 正常 0 禁用
    createTime: { type: Number, default: null }, // 创建时间
    updateTime: { type: Number, default: null }, // 更新时间
  });

  return mongoose.model('Admin', AdminSchema);
};
