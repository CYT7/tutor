/**
 * @author: Chen yt7
 * @date: 2020/12/12 1:10 PM
 */
'use strict';
/**
 * 管理后台路由分发
 */
module.exports = app => {
  const { router, controller } = app;
  /**
   * 用户相关接口
   **/
  const userApi = '/business/user';
  router.post(`${userApi}/create`, controller.business.user.create);
  router.post(`${userApi}/login`, controller.business.user.login);
  router.post(`${userApi}/information`, controller.business.user.information);
  router.put(`${userApi}/information`, controller.business.user.modify);
};
