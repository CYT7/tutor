/**
 * @author: Chenyt
 * @date: 2020/12/20 1:45 PM
 */
'use strict';
module.exports = (app, auth) => {
  if (!auth) { return [ -1, '请求失败' ]; }
  let decode;
  try {
    const token = auth.split(' ')[1];
    decode = app.jwt.verify(token, app.config.jwt.secret);
  } catch (e) {
    return [ -2, '请求失败' ];
  }
  const exp = Math.round(new Date() / 1000) + (60 * 60 * 3);
  const token = app.jwt.sign({
    name: decode.name,
    iat: Math.round(new Date() / 1000),
    exp,
  }, app.config.jwt.secret);
  return [ 0, token, exp, decode.name ];
};
