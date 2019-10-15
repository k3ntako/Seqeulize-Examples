'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    tableName: 'users'
  });
  User.associate = function(models) {
    User.hasOne(models.UserAuth, {
      foreignKey: 'user_id',
      as: 'auth'
    });
    User.belongsToMany(models.Course, {
      through: 'UserCourse'
    });
  };
  return User;
};