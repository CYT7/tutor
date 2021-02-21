/**
 * @author: chen yt7
 * @date: 2021/2/20 22:00 PM
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const BannerSchema = new Schema({
    carousel: String,
    sequence: Number,
    deleted: { type: Number, default: 1 }, // 是否已软删除  1否 0是
    createTime: { type: Number, default: null }, // 创建时间
    updateTime: { type: Number, default: null }, // 更新时间
  });
  return mongoose.model('Banners', BannerSchema);
};
