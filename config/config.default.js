/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1607653345197_6388';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };


  config.sequelize = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'tutor',
    username: 'root',
    password: '990129',
    define: {
      freezeTableName: true,
      underscored: true,
      timestamps: false,
      createdAt: 'create_time',
      updatedAt: 'update_time',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
