/**
 * @author: Chen yt7
 * @date: 2020/12/15 1:05 PM
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TeacherSchema = new Schema({
    id: { type: String, allowNull: false },
    User: { type: Schema.Types.ObjectId, ref: 'User' }, // 用户
    realName: { type: String, default: null }, // 真实姓名
    identityCard: { type: String, default: null }, // 身份证
    StudentCard: { type: String, default: null }, // 学生证
    totalSuccess: { type: Number, default: 0 }, // 成功次数
    experience: { type: Number, default: 0 }, // 教学经验(年)
    age: { type: Number, default: 0 }, // 年龄
    goodAt: { type: String, default: null }, // 擅长科目
    state: { type: Number, default: 1 }, // 审核状态 1已提交 2审核不通过 3审核通过
    hourPrice: { type: Number, default: 0 }, // 课时费用
    school: { type: String, default: null }, // 在读/毕业院校
    city: { type: Array, default: null }, // 所在城市
    status: { type: Number, default: 1 }, // 状态 0禁用 1正常
    createTime: { type: Number, default: null }, // 创建时间
    updateTime: { type: Number, default: null }, // 更新时间
  });

  return mongoose.model('Teacher', TeacherSchema);
};
