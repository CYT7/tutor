/**
 * @author: Chen yt7
 * @date: 2020/12/12 2:30 PM
 */
'use strict';
/**
 * 管理后台路由分发
 */
module.exports = app => {
  const { router, controller } = app;
  /**
   * 管理员相关接口
   */
  const adminApi = '/admin';
  router.post(`${adminApi}/create`, controller.admin.admin.create);
  router.get(`${adminApi}/index`, controller.admin.admin.index);
};