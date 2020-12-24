/**
 * @author: Chen yt7
 * @date: 2020/12/15 3:00 PM
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const CommentSchema = new Schema({
    id: { type: String },
    formId: { type: Number, default: null }, // 学生 评论人
    toId: { type: String, default: null }, // 老师 被评论者
    need: { type: Schema.Types.ObjectId, ref: 'Need' }, // 评论给哪个需求
    appoint: { type: Schema.Types.ObjectId, ref: 'Appoint' }, // 评论给哪个预约
    content: { type: String, default: null }, // 评论内容
    type: { type: Number, default: 1 }, // 类型 1好评 2中评 3差评
    rank: { type: Number, default: 1 }, // 评分登记1-5
    status: { type: Number, default: 1 }, // 状态 0禁用 1正常
    createTime: { type: Number, default: null }, // 创建时间
    updateTime: { type: Number, default: null }, // 更新时间
  });

  return mongoose.model('Comment', CommentSchema);
};
