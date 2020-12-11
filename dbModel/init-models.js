var DataTypes = require("sequelize").DataTypes;
var _appoint = require("./appoint");
var _category = require("./category");
var _comment = require("./comment");
var _member = require("./member");
var _need = require("./need");
var _teacher = require("./teacher");
var _teacher_category = require("./teacher_category");
var _user = require("./user");

function initModels(sequelize) {
  var appoint = _appoint(sequelize, DataTypes);
  var category = _category(sequelize, DataTypes);
  var comment = _comment(sequelize, DataTypes);
  var member = _member(sequelize, DataTypes);
  var need = _need(sequelize, DataTypes);
  var teacher = _teacher(sequelize, DataTypes);
  var teacher_category = _teacher_category(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  teacher.belongsTo(member, { foreignKey: "user_id"});
  member.hasMany(teacher, { foreignKey: "user_id"});

  return {
    appoint,
    category,
    comment,
    member,
    need,
    teacher,
    teacher_category,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
