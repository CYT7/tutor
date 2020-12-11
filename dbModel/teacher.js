const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('teacher', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "用户id外键",
      references: {
        model: 'member',
        key: 'id'
      }
    },
    total_success: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
      comment: "成功次数"
    },
    total_comment: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
      comment: "评论次数"
    },
    experience: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
      comment: "教学经验(年)"
    },
    age: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
      comment: "年龄"
    },
    nickname: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "昵称"
    },
    realname: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "真实姓名"
    },
    good_at: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "擅长科目"
    },
    resume: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "个人简介"
    },
    qq: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "QQ"
    },
    wechat: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "微信"
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "联系方式"
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "邮箱"
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "头像地址"
    },
    gender: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "性别 1男 2女"
    },
    state: {
      type: DataTypes.TINYINT.UNSIGNED.ZEROFILL,
      allowNull: true,
      defaultValue: 0001,
      comment: "审核状态 1已提交 2审核不通过 3审核通过"
    },
    hour_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      comment: "课时费用"
    },
    balance: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      comment: "余额"
    },
    last_login_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "最近登录时间"
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
    tableName: 'teacher',
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
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
