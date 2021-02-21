/**
 * @author: Chen yt7
 * @date: 2021/02/21 10:45 AM
 */
'use strict';

const Controller = require('egg').Controller;

class BannersController extends Controller {

  async listBanner() {
    const { ctx, service } = this;
    const res = await service.banner.BannerList();
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
}

module.exports = BannersController;

