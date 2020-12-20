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
  // csrf config
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ '*' ],
  };

  // MongoDB config
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/tutor',
      options: {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      },
      plugins: [],
      loadModel: true,
      app: true,
      agent: false,
    },
  };

  config.paginatorConfig = {
    pageSize: 12,
  };

  config.jwt = {
    secret: 'nPp1rYeZhq2HNfD3AO}I0aGV+Z^5/-LM~Wu7S&ejxKlJwiE4Fve+B8dgCXtQyUbs9oR6cT*k',
  };

  return {
    ...config,
    ...userConfig,
  };
};
