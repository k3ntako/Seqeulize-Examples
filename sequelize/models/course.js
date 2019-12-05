'use strict';
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    name: DataTypes.STRING,
  }, {
    tableName: 'courses',
  });

  Course.associate = function(models) {
    Course.hasMany(models.Assignment, {
      foreignKey: 'course_id',
      as: 'assignments',
    });

    Course.hasMany(models.UserCourse, {
      foreignKey: 'course_id',
      as: 'userCourses',
    });


    Course.belongsToMany(models.User, {
      through: 'UserCourse',
      foreignKey: "user_id",
      as: 'users',
    });
  };

  return Course;
};