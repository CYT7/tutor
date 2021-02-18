/**
 * @author: Chen yt7
 * @date: 2020/02/01 9:40 PM
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ApplicationSchema = new Schema({
    Need: { type: Schema.Types.ObjectId, ref: 'Need' }, // 用户
    Teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' }, // 老师id
    createTime: { type: Number, default: null }, // 创建时间
    updateTime: { type: Number, default: null }, // 更新时间
  });

  return mongoose.model('Application', ApplicationSchema);
};
