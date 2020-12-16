/**
 * @author: Chen yt7
 * @date: 2020/12/15 2:55 PM
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const NeedSchema = new Schema({
    id: { type: String },
    User: { type: Schema.Types.ObjectId, ref: 'User' }, // 用户
    tradeNo: { type: String, default: null }, // 订单号
    nickName: { type: String, default: null }, // 称呼，如陈同学，详情页展示(必选)
    phone: { type: String, default: null }, // 联系电话，家教中标才展示,详情页面不展示(必选)
    wechat: { type: String, default: null }, // 微信号，教员中标后才展示,详情页面不展示(可选)
    qq: { type: String, default: null }, // QQ 教员中标后才展示,详情页面不展示(可选)
    gender: { type: Number, default: 0 }, // 性别 1男2女，详情页展示(必选)
    teacherGender: { type: Number, default: 0 }, // 教师性别要求 0不限1男2女 搜索条件(必选)
    studentComment: { type: Number, default: 0 }, // 学生是否已评论 0未评论 1已评论
    teacherComment: { type: Number, default: 0 }, // 老师是否已评论 0未评论 1已评论
    address: { type: String, default: null }, // 地址
    teach_date: { type: String, default: null }, // 上课时间
    total_appoint: { type: Array, default: null }, // 预约人数
    frequency: { type: Number, default: 0 }, // 总共几次(必选)
    timeHour: { type: Number, default: 0 }, // 每次几小时(必选)
    hourPrice: { type: Number, default: 0 }, // 每小时几元(必选)
    totalPrice: { type: Number, default: 0 }, // 总报价(必选)
    state: { type: Number, default: 1 }, // 审核状态 1审核中,2审核不通过，3审核通过，4已选定，5已完成，6已关闭。
    reason: { type: String, default: null }, // 关闭原因
    sort: { type: Number, default: 0 }, // 排序
    deleted: { type: Number, default: 0 }, // 家长是否已软删除 0否 1是
    status: { type: Number, default: 1 }, // 状态 0禁用 1正常
    createTime: { type: Number, default: null }, // 创建时间
    updateTime: { type: Number, default: null }, // 更新时间
  });

  return mongoose.model('Need', NeedSchema);
};
