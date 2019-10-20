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
      through: 'UserCourse',
      foreignKey: "course_id",
      as: 'courses'
    });
  };

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  User.findByEmail = async (email) => {
    email = email.trim().toLowerCase();
    
    if (!email.match(EMAIL_REGEX)) {
      return null;
    }

    return await User.findOne({ where: { email } });
  }

  return User;
};