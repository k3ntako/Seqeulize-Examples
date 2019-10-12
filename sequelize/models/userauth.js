'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserAuth = sequelize.define('UserAuth', {
    passhash: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {
    tableName: 'user_auths'
  });
  UserAuth.associate = function(models) {
    UserAuth.belongsTo(models.User, {
      foreignKey: 'user_id',
    });
  };
  return UserAuth;
};