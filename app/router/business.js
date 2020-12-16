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

  /**
   * 教师相关接口
   **/
  const teacherApi = '/business/teacher';
  router.post(`${teacherApi}/create`, controller.business.teacher.create);
  router.post(`${teacherApi}/information`, controller.business.teacher.information);
  router.put(`${teacherApi}/information`, controller.business.teacher.modify);

  /**
   * 需求相关接口
   */
  const needApi = '/business/need';
  router.post(`${needApi}/create`, controller.business.need.create);
  router.post(`${needApi}/apply`, controller.business.need.apply);
};
