'use strict';
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('UserCourse', {
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

  Course.associate = function(models) {
    Course.belongsTo(models.Course);
    Course.belongsTo(models.User);
  };
  return Course;
};