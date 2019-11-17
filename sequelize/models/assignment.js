'use strict';
module.exports = (sequelize, DataTypes) => {
  const Assignment = sequelize.define('Assignment', {

    name: DataTypes.STRING,
    due_date: DataTypes.DATE,
  }, {
    tableName: 'assignments',
  });

  Assignment.associate = function(models) {
    Assignment.belongsTo(models.Course, {
      foreignKey: 'course_id',
    });
  };
  return Assignment;
};