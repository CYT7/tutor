/**
 * @author: Chen yt7
 * @date: 2020/12/15 2:55 PM
 */
'use strict';

module.exports = app => {

  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const NeedSchema = new Schema({
    id: { type: String, allowNull: false }, // 需求id
    User: { type: Schema.Types.ObjectId, ref: 'User' }, // 用户
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' }, // 老师id
    nickName: { type: String, default: null }, // 称呼，如陈同学，详情页展示(必选)
    phone: { type: String, default: null }, // 联系电话，家教中标才展示,详情页面不展示(必选)
    wechat: { type: String, default: null }, // 微信号，教员中标后才展示,详情页面不展示(可选)
    qq: { type: String, default: null }, // QQ 教员中标后才展示,详情页面不展示(可选)
    gender: { type: Number, default: 1 }, // 性别 1保密 2男 3女 详情页展示(必选)
    teacherGender: { type: Number, default: 1 }, // 要求教师性别 1保密 2男 3女 搜索条件(必选)
    city: { type: Array, default: null }, // 城市
    address: { type: String, default: null }, // 详情地址
    teach_date: { type: String, default: null }, // 上课时间
    subject: { type: String, default: null }, // 科目
    frequency: { type: Number, default: 0 }, // 总共几次(必选)
    timeHour: { type: Number, default: 0 }, // 每次几小时(必选)
    hourPrice: { type: Number, default: 0 }, // 每小时几元(必选)
    totalPrice: { type: Number, default: 0 }, // 总报价(必选)
    state: { type: Number, default: 1 }, // 审核状态 1审核中,2审核不通过，3审核通过，4已选定，5已完成，6已关闭。
    deleted: { type: Number, default: 0 }, // 家长是否已软删除 0否 1是
    content: { type: String }, // 评论
    rate: { type: Number }, // 评分
    createTime: { type: Number, default: null }, // 创建时间
    updateTime: { type: Number, default: null }, // 更新时间
  });

  return mongoose.model('Need', NeedSchema);
};
