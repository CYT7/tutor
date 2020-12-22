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
  router.post(`${needApi}/confirm`, controller.business.need.confirm);
  router.post(`${needApi}/finish`, controller.business.need.finish);
  router.post(`${needApi}/information`, controller.business.need.information);
  router.post(`${needApi}/close`, controller.business.need.close);
  router.put(`${needApi}/modify`, controller.business.need.modify);
  router.get(`${needApi}/list`, controller.business.need.list);

  /**
   * 预约相关接口
   **/
  const appointApi = '/business/appoint';
  router.post(`${appointApi}/see`, controller.business.appoint.see);
  router.post(`${appointApi}/finish`, controller.business.appoint.finish);
  router.post(`${appointApi}/close`, controller.business.appoint.close);
  router.get(`${appointApi}/list`, controller.business.appoint.list);
};
