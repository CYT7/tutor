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
  router.put(`${userApi}/modify`, controller.business.user.modify);
  router.post(`${userApi}/saveAvatar`, controller.business.user.saveAvatar);
  router.post(`${userApi}/balanceAdd`, controller.business.user.balanceAdd);
  /**
   * 教师相关接口
   **/
  const teacherApi = '/business/teacher';
  router.post(`${teacherApi}/create`, controller.business.teacher.create);
  router.post(`${teacherApi}/information`, controller.business.teacher.information);
  router.put(`${teacherApi}/information`, controller.business.teacher.modify);
  router.post(`${teacherApi}/Information`, controller.business.teacher.informationofUser);
  router.get(`${teacherApi}/list`, controller.business.teacher.list);
  router.get(`${teacherApi}/recommendList`, controller.business.teacher.listOfRecommend);

  /**
   * 需求相关接口
   */
  const needApi = '/business/need';
  router.post(`${needApi}/create`, controller.business.need.create);
  router.post(`${needApi}/apply`, controller.business.need.apply);
  router.post(`${needApi}/confirm`, controller.business.need.confirm);
  router.post(`${needApi}/finish`, controller.business.need.finish);
  router.post(`${needApi}/information`, controller.business.need.information);
  router.post(`${needApi}/userClose`, controller.business.need.userClose);
  router.post(`${needApi}/teacherClose`, controller.business.need.teacherClose);
  router.put(`${needApi}/modify`, controller.business.need.modify);
  router.get(`${needApi}/list`, controller.business.need.list);
  router.get(`${needApi}/Userlist`, controller.business.need.Userlist);
  router.get(`${needApi}/Teacherlist`, controller.business.need.Teacherlist);
  router.get(`${needApi}/List`, controller.business.need.List);
  /**
   * 预约相关接口
   **/
  const appointApi = '/business/appoint';
  router.post(`${appointApi}/create`, controller.business.appoint.create);
  router.post(`${appointApi}/agree`, controller.business.appoint.agree);
  router.post(`${appointApi}/disagree`, controller.business.appoint.disagree);
  router.post(`${appointApi}/pay`, controller.business.appoint.pay);
  router.post(`${appointApi}/teacherSee`, controller.business.appoint.teacherSee);
  router.post(`${appointApi}/userSee`, controller.business.appoint.userSee);
  router.post(`${appointApi}/finish`, controller.business.appoint.finish);
  router.post(`${appointApi}/userClose`, controller.business.appoint.userClose);
  router.post(`${appointApi}/teacherClose`, controller.business.appoint.teacherClose);
  router.get(`${appointApi}/userList`, controller.business.appoint.userList);
  router.get(`${appointApi}/teacherList`, controller.business.appoint.teacherList);

  const categoryApi = '/business/category';
  router.get(`${categoryApi}/List`, controller.business.category.listOfUser);

};
