const crypto = require('crypto');
const db = require('./sequelize/models');
const User = db.User;
const UserAuth = db.UserAuth;
const { parseName } = require('./utilities');

module.exports = {
  usercreate: {
    question: "Name of user, first and last name, split by a space (e.g, Steve Gates):",
    purpose: "Create and commit to db a User.",
    callback: async (name, cb) => {
      try {
        const [firstName, lastName, email] = parseName(name);

        const user = await User.create({
          firstName, lastName, email,
        });
        if (user) console.log('Created: ', user.dataValues);

        cb();
      } catch (error) {
        console.error(error);
      }
    }
  },
  userfindbypk: {
    question: "User ID:",
    purpose: "Find user by primary key (pk) and return User and associated UserAuth.",
    callback: async (id, cb) => {
      try {
        const user = await User.findByPk(Number(id), { include: { model: UserAuth, as: "auth" } });

        if (user) {
          console.log('Found: ', user.toJSON());
        } else {
          console.log('User not found by ID: ' + id);
        };

        cb();
      } catch (error) {
        console.error(error);
      }
    }
  },
  authcreate: {
    question: "User ID that you'd like to assign this auth to:",
    purpose: "Create and commit to db an UserAuth, with association to a User.",
    callback: async (id, cb) => {
      try {
        const user = await User.findByPk(Number(id));
        if (!user) throw new Error("No user with that id: " + id);

        const salt = crypto.randomBytes(16).toString('hex');

        const auth = await UserAuth.create({
          user_id: user.id,
          passhash: crypto.pbkdf2Sync("password", salt, 1000, 64, `sha512`).toString(`hex`), //password is alway "password"
          salt: salt,
        }, {
          include: [User]
        });

        if (auth) console.log('Created: ', auth.toJSON());

        cb();
      } catch (error) {
        console.error(error);
      }
    }
  },
  bothcreate: {
    question: "Name of user, first and last name, split by a space (e.g, Steve Gates):",
    purpose: "Create and commit to db both a User and an associated UserAuth with one call.",
    callback: async (name, cb) => {
      try {
        const [firstName, lastName, email] = parseName(name);
        const salt = crypto.randomBytes(16).toString('hex');

        const user = await User.create({
          firstName, lastName, email,
          auth: {
            passhash: crypto.pbkdf2Sync("password", salt, 1000, 64, `sha512`).toString(`hex`), //password is alway "password"
            salt: salt,
          }
        }, {
          include: [{
            association: User.associations.auth,
          }],
        });

        if (user) console.log('Created: ', user.toJSON());

        cb();
      } catch (error) {
        console.error(error);
      }
    }
  },

}