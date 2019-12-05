'use strict';
const crypto = require('crypto');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const userAttributes = [
      { firstName: "Kentaro", lastName: "Kaneki", email: "kentarokaneki@example.com" },
      { firstName: "Cindy", lastName: "Wang", email: "cindywang@example.com" },
    ].map(user => ({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return queryInterface.bulkInsert(
      'users',
      userAttributes,
      { returning: true }
    ).then(users => {
      const authAttributes = users.map(user => {
        const salt = crypto.randomBytes(16).toString('hex');
        return {
          user_id: user.id,
          passhash: crypto.pbkdf2Sync("password", salt, 1000, 64, `sha512`).toString(`hex`), //password is always "password"
          salt: salt,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });

      return queryInterface.bulkInsert('user_auths', authAttributes, {})
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};