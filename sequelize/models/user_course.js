'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserCourse = sequelize.define('UserCourse', {
    user_id: {
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
      type: DataTypes.INTEGER
    },
    course_id: {
      allowNull: false,
      references: {
        model: 'course',
        key: 'id',
      },
      type: DataTypes.INTEGER
    },
  }, {
    tableName: 'user_courses',
  });

  UserCourse.associate = function(models) {
    UserCourse.belongsTo(models.Course);
    UserCourse.belongsTo(models.User);
  };

  return UserCourse;
};