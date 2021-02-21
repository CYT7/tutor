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
  // use for cookie sign key, should change to your own and keep security;用于cookie签名密钥，应更改为您自己的并保持安全
  config.keys = appInfo.name + '_1607653345197_6388';
  config.projectName = {
    AppName: appInfo.name,
  };
  // add your middleware config here;在此处添加中间件配置
  config.middleware = [ 'jwtAuth', 'userAuth' ];
  // add your user config here;在此处添加您的用户配置
  const userConfig = {
    myAppName: 'tutor',
  };
  // csrf config csrf配置
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ '*' ], // 允许访问接口的白名单
  };
  // 跨域的配置
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };
  // MongoDB config MongoDB配置
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
  config.cluster = {
    listen: {
      port: 7001,
      hostname: '127.0.0.1',
    },
  };
  config.paginatorConfig = {
    pageSize: 10,
  };
  config.uploadDir = 'app/public/static/upload';
  config.jwt = {
    secret: 'nPp1rYeZhq2HNfD3AO}I0aGV+Z^5/-LM~Wu7S&ejxKlJwiE4Fve+B8dgCXtQyUbs9oR6cT*k',
  };
  config.jwtAuth = {
    enable: false,
    ignore: [ '/business', '/admin/login', '/public' ],
  };
  config.userAuth = {
    enable: true,
    ignore: [ '/admin', '/business/user/login', '/business/user/create', '/public' ],
  };
  return {
    ...config,
    ...userConfig,
  };
};
