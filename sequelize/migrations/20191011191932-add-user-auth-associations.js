'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.sequelize.transaction(function (t) {
      return queryInterface.addColumn(
        'user_auths',
        'user_id',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        { transaction: t },
      )
    });

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('user_auths', 'user_id')
  }
};
