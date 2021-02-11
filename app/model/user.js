/**
 * @author: Chen yt7
 * @date: 2020/12/13 4:05 PM
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    id: Number,
    nickName: { type: String, default: null }, // 昵称
    phone: { type: String, default: null }, // 联系方式
    email: { type: String, default: null }, // 邮箱
    password: String, // 密码
    qq: { type: String, default: null }, // QQ
    wechat: { type: String, default: null }, // 微信号
    address: { type: Array, default: null }, // 地址
    balance: { type: Number, default: 0 }, // 余额
    gender: { type: Number, default: 1 }, // 性别 1保密 2男 3女
    status: { type: Number, default: 1 }, // 状态 1 正常 0 禁用
    type: { type: Number, default: 0 }, // 性别 0 仅学生，1学生老师
    image_url: { type: String, default: null }, // 头像地址
    createTime: { type: Number, default: null }, // 创建时间
    loginTime: { type: Number, default: null }, // 最后登录时间
    updateTime: { type: Number, default: null }, // 更新时间
  });

  return mongoose.model('User', UserSchema);
};
