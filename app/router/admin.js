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
  router.post(`${adminApi}/login`, controller.admin.admin.login);
  router.post(`${adminApi}/information`, controller.admin.admin.information);
  router.put(`${adminApi}/information`, controller.admin.admin.modify);
  router.get(`${adminApi}/list`, controller.admin.admin.list);

  /**
   * 分类相关接口
   */
  const categoryApi = '/admin/category';
  router.post(`${categoryApi}/create`, controller.admin.category.create);
  router.delete(`${categoryApi}/delete`, controller.admin.category.del);
  router.put(`${categoryApi}/modify`, controller.admin.category.modify);
  router.get(`${categoryApi}/list`, controller.admin.category.list);

  const userApi = '/admin/user';
  router.get(`${userApi}/list`, controller.admin.user.list);
};
