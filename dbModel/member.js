const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('member', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    nickname: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      comment: "昵称"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "密码"
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "联系电话"
    },
    adress: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "地址"
    },
    gender: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "性别 1男 2女"
    },
    qq: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "QQ"
    },
    wechat: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "微信号"
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "头像地址"
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
    tableName: 'member',
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
