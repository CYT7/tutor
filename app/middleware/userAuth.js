/**
 * @author: Chen yt7
 * @date: 2020/1/26 4:50 PM
 */
'use strict';
/**
 * 这是一个前台JWT鉴权中间件，
 **/
module.exports = (options, app) => {
  return async function adminAuth(ctx, next) {
    const param = ctx.request.header.authorization;
    console.log(`User JWT MiddleWare Start At: ${ctx.request.url}`);
    if (!param) {
      ctx.body = { code: 404, msg: '没有验证头部' };
      ctx.status = 201;
    } else {
      const arrayParam = param.split(' ');
      if (arrayParam.length !== 2) {
        ctx.body = { code: 401, msg: 'Token无效' };
        ctx.status = 201;
      } else {
        let decode;
        try {
          const token = param.split(' ')[1];
          decode = app.jwt.verify(token, options.secret);
          if ((Math.round(new Date() / 1000) - decode.exp) > 0) {
            ctx.body = { code: 401, msg: 'Token过期' };
            ctx.status = 201;
          }
          const user = await ctx.model.User.findOne({ _id: decode.name });
          if (user) {
            await next();
          } else {
            ctx.body = { code: 404, msg: '用户不存在' };
            ctx.status = 201;
          }
        } catch (e) {
          ctx.body = { code: 401, msg: 'Token无效' };
          ctx.status = 201;
        }
      }
    }
  };
};
