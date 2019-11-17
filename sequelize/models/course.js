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

    Course.belongsToMany(models.User, {
      through: 'UserCourse',
      foreignKey: "user_id",
      as: 'users',
    });
  };

  const beforeDestroy = async (id, transaction) => {
    const assignmentDestroyCount = await sequelize.models.Assignment.destroy({
      where: { course_id: id },
      transaction,
    });

    console.log(`Deleted ${assignmentDestroyCount} assignment(s).`);

    const userCourseDestroyCount = await sequelize.models.UserCourse.destroy({
      where: { course_id: id },
      transaction,
    });

    console.log(`Deleted ${userCourseDestroyCount} user_course(s).`);
  }

  // Two different ways to define hooks
  Course.addHook('beforeDestroy', (course, options) => beforeDestroy(course.id, options.transaction));
  Course.beforeBulkDestroy((options) => beforeDestroy(options.where.id, options.transaction));

  return Course;
};