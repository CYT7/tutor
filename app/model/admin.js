/**
 * @author: Chen yt7
 * @date: 2020/12/12 6:50 PM
 */

'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AdminSchema = new Schema({
    id: Number,
    name: String,
    realName: String,
    password: String,
    status: { type: Number, default: 1 }, // 1 正常 0 禁用
    createTime: Number,
  });

  return mongoose.model('Admin', AdminSchema);
};
