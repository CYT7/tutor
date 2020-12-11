const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comment', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    from_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "学生id_外键(用户) 评论人"
    },
    to_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "老师id_外键(用户) 被评论者"
    },
    need_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "需求id_外键 评论给哪个需求"
    },
    appoint_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "预约id_外键"
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "评论内容"
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
      comment: "类型 1好评 2中评 3差评"
    },
    rank: {
      type: DataTypes.TINYINT.UNSIGNED.ZEROFILL,
      allowNull: true,
      comment: "评分等级 1-5"
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
      comment: "状态 0禁用 1启用"
    },
    sort: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
      comment: "排序"
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
    tableName: 'comment',
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
