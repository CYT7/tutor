/**
 * @author: Chen yt7
 * @date: 2020/12/12 1:10 PM
 */
'use strict';

/**
 * @param {Egg.Application} app - egg application
 * 主路由分发：
 * 1.管理后台路由前缀： /admin/{version}
 * 2.前端路由前缀： /business/{version}
 */
module.exports = app => {
  require('./router/admin')(app);
  require('./router/business')(app);
  // const { router, controller } = app;
  // router.get('/', controller.home.index);
};
