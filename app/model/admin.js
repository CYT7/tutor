/**
 * @author: Chen yt7
 * @date: 2020/12/12 6:50 PM
 * @CompletionDate：2020/01/26 1:50PM
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const AdminSchema = new Schema({
    id: { type: Number, allowNull: false }, // 管理员id
    name: { type: String, allowNull: false }, // 管理员登陆名
    realName: { type: String, default: null }, // 管理员真实姓名
    password: { type: String, allowNull: false }, // 管理员登陆密码
    status: { type: Number, default: 1 }, // 管理员状态 1 正常 0 禁用
    deleted: { type: Number, default: 1 }, // 是否已软删除  1否 0是
    createTime: { type: Number, default: null }, // 创建时间
    updateTime: { type: Number, default: null }, // 更新时间
    loginTime: { type: Number, default: null }, // 登录时间
  });
  return mongoose.model('Admin', AdminSchema);
};
