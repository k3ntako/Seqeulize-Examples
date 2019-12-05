'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('course_semester', {
      semester_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'semesters',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'cascade'
      },
      course_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'courses',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('course_semester');
  }
};