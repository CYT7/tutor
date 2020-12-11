const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('need', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    nickname: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "称呼，如陈同学，详情页展示(必选)"
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "联系电话，家教中标才展示,详情页面不展示(必选)"
    },
    wechat: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "微信号，教员中标后才展示,详情页面不展示(可选)"
    },
    qq: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "QQ 教员中标后才展示,详情页面不展示(可选)"
    },
    gender: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: "性别 1男2女，详情页展示(必选)"
    },
    teacher_gender: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: "教师性别要求 1男2女3不限 搜索条件(必选)"
    },
    state: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
      comment: "审核状态 1审核中,2审核不通过，3审核通过，4已选定，5已完成，6已关闭。"
    },
    student_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "家长id_外键(用户)"
    },
    first_category_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "一级分类_外键 搜索条件 如小学 必选"
    },
    second_category_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "二级分类_外键 搜索条件 如一年级 必选"
    },
    third_category_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "三级分类_外键 搜索条件 如数学 必选"
    },
    teacher_comment_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "老师评论id_外键"
    },
    student_comment_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "家长评论id_外键"
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "详细地址,详情页展示(必选)"
    },
    teach_date: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "可上课时间, 序列化后的对象(必选)"
    },
    total_appoint: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
      comment: "预约总人数"
    },
    frequency: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "上课次数(必选)"
    },
    time_hour: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "每次上课小时(必选)"
    },
    hour_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      comment: "每小时价格(必选)"
    },
    total_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      comment: "总价(必选)"
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "关闭原因"
    },
    sort: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
      comment: "排序"
    },
    deleted: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      comment: "家长是否已软删除 0否 1是"
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
      comment: "状态 0禁用 1启用"
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "创建时间"
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "更新时间"
    }
  }, {
    sequelize,
    tableName: 'need',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
