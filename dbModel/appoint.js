const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('appoint', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    need_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "需求id_外键"
    },
    student_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "家长id_外键(用户id)"
    },
    teacher_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "老师id_外键(用户id)"
    },
    trade_no: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "订单号"
    },
    student_comment_state: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      comment: "学生是否已评论 0未评论 1已评论"
    },
    teacher_comment_state: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      comment: "老师是否已评论 0未评论 1已评论"
    },
    student_delete_state: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      comment: "学生是否已软删除 0未删除 1已删除"
    },
    teacher_delete_state: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      comment: "老师是否已软删除 0未删除 1已删除"
    },
    state: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "状态 1已预约 2待付款 已中标 3试教中 4进行中 5待结课 6待关闭 7待评论 8已完成 9已关闭"
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
    status: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
      comment: "状态 0禁用 1启用"
    },
    frequency: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "总共几次"
    },
    time_hour: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "每次几小时"
    },
    hour_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      comment: "每小时几元"
    },
    total_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      comment: "老师报价"
    },
    nickname: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "昵称"
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "联系手机号"
    },
    wechat: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "微信号"
    },
    qq: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "QQ"
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "地址"
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "科目"
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
    tableName: 'appoint',
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
