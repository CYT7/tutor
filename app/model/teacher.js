/**
 * @author: Chen yt7
 * @date: 2020/12/15 1:05 PM
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TeacherSchema = new Schema({
    id: Number,
    User: { type: Schema.Types.ObjectId, ref: 'User' }, // 用户
    totalSuccess: { type: Number, default: 0 }, // 成功次数
    totalComment: { type: Number, default: 0 }, // 评论次数
    experience: { type: Number, default: 0 }, // 教学经验(年)
    age: { type: Number, default: 0 }, // 年龄
    goodAt: { type: String, default: null }, // 擅长科目
    State: { type: Number, default: 0 }, // 审核状态 1已提交 2审核不通过 3审核通过
    hourPrice: { type: Number, default: 0 }, // 课时费用
    status: { type: Number, default: 1 }, // 状态 0禁用 1正常
    createTime: { type: Number, default: null }, // 创建时间
    updateTime: { type: Number, default: null }, // 更新时间
  });

  return mongoose.model('Teacher', TeacherSchema);
};
