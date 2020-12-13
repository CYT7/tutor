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
    nickName: String,
    realName: String,
    qq: Number,
    wechat: String,
    phone: String,
    password: String,
    gender: { type: Number, default: 0 }, // 0未知，1男 2女
    status: { type: Number, default: 1 }, // 1 正常 0 禁用
    createTime: Number,
    updateTime: Number,
  });

  return mongoose.model('Admin', AdminSchema);
};
