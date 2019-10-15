'use strict';
module.exports = (sequelize, DataTypes) => {
  const Assignment = sequelize.define('Assignment', {
    course_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'course',
        key: 'id',
      },
      allowNull: false
    },
    name: DataTypes.STRING,
    due_date: DataTypes.DATE,
  }, {
    tableName: 'assignments',
  });

  Assignment.associate = function(models) {
    Assignment.belongsTo(models.Course);
  };
  return Assignment;
};