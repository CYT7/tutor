/**
 * @author: Chen yt7
 * @date: 2020/12/15 3:00 PM
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const CategorySchema = new Schema({
    id: Number,
    parentId: { type: Number, default: 0 }, // 父级id
    name: { type: String, default: 0 }, // 名字
    status: { type: Number, default: 1 }, // 状态 0禁用 1正常
    deleted: { type: Number, default: 1 }, // 是否已软删除 0是 1否
    createTime: { type: Number, default: null }, // 创建时间
    updateTime: { type: Number, default: null }, // 更新时间
  });

  return mongoose.model('Category', CategorySchema);
};
