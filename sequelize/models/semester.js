'use strict';
module.exports = (sequelize, DataTypes) => {
  const Semester = sequelize.define('Semester', {
    name: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
  }, {
    tableName: 'semesters',
  });

  Semester.associate = function(models) {
    Semester.belongsToMany(models.Course, {
      through: 'CourseSemester',
      foreignKey: "semester_id",
      as: 'semester',
    });
  };
  return Semester;
};