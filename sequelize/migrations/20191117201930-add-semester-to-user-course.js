'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('user_courses', 'semester_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'semesters',
        key: 'id',
      },
      allowNull: false,
      onDelete: 'cascade'
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('user_courses', 'semester_id');
  }
};