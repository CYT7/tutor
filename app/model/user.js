/**
 * @author: Chenyt
 * @date: 2020/12/11 11:00 AM
 */
'use strict';
module.exports = app => {
  const DataTypes = app.Sequelize;
  return app.model.define(
    'user', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '用户名',
      },
      nickname: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '昵称名',
      },
      realname: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '真实姓名',
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '密码',
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '邮箱',
      },
      phone: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '联系方式',
      },
      status: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 1,
        comment: '状态 0禁用 1启用',
      },
      create_time: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '创建时间',
      },
      update_time: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '更新时间',
      },
    }, {
      tableName: 'user',
    });
};
