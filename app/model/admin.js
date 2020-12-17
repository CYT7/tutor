/**
 * @author: Chen yt7
 * @date: 2020/12/12 6:50 PM
* @modifyDate：2020/12/17 8：40PM
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AdminSchema = new Schema({
    id: Number, // 管理员编号
    name: String, // 管理员登陆名
    realName: String, // 管理员真实姓名
    password: String, // 管理员登陆密码
    status: { type: Number, default: 1 }, // 管理员状态 1 正常 0 禁用
    deleted: { type: Number, default: 1 }, // 是否已软删除  1否 0是
    createTime: Number, // 创建时间
    updateTime: Number, // 更新时间
  });

  return mongoose.model('Admin', AdminSchema);
};
