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
  router.put(`${adminApi}/modify`, controller.admin.admin.modifyAdmin);
  router.get(`${adminApi}/list`, controller.admin.admin.list);
  router.get(`${adminApi}/index`, controller.admin.admin.index);
  router.delete(`${adminApi}/delete`, controller.admin.admin.delete);

  /**
   * 分类相关接口
   */
  const categoryApi = '/admin/category';
  router.post(`${categoryApi}/create`, controller.admin.category.create);
  router.delete(`${categoryApi}/delete`, controller.admin.category.del);
  router.get(`${categoryApi}/list`, controller.admin.category.list);
  router.get(`${categoryApi}/List`, controller.admin.category.listOfAdmin);

  /**
   * 教师相关接口
   */
  const teacherApi = '/admin/teacher';
  router.post(`${teacherApi}/agree`, controller.admin.teacher.agree);
  router.post(`${teacherApi}/disagree`, controller.admin.teacher.disagree);
  router.get(`${teacherApi}/list`, controller.admin.teacher.list);

  /**
   * 用户相关接口
   */
  const userApi = '/admin/user';
  router.get(`${userApi}/list`, controller.admin.user.list);

  /**
   * 需求相关接口
   */
  const needApi = '/admin/need';
  router.get(`${needApi}/list`, controller.admin.need.list);
  router.post(`${needApi}/agree`, controller.admin.need.agree);
  router.post(`${needApi}/disagree`, controller.admin.need.disagree);

  /**
   * 预约相关接口
   */
  const appointApi = '/admin/appoint';
  router.get(`${appointApi}/list`, controller.admin.appoint.list);

  /**
   * 预约相关接口
   */
  const bannerApi = '/admin/banner';
  router.post(`${bannerApi}/create`, controller.admin.banner.createBanners);
};
