const crypto = require('crypto');
const db = require('./sequelize/models');
const User = db.User;
const UserAuth = db.UserAuth;
const { parseName } = require('./utilities');

module.exports = {
  usercreate: {
    question: "Name of user, first and last name, split by a space (e.g, Steve Gates):",
    purpose: "Create and commit to db a User.",
    method: async (name) => {
      const [firstName, lastName, email] = parseName(name);

      const user = await User.create({
        firstName, lastName, email,
      });
      if (user) console.log('Created: ', user.dataValues);
    }
  },
  userfindbypk: {
    question: "User ID:",
    purpose: "Find user by primary key (pk) and return User and associated UserAuth.",
    method: async (id) => {
      const user = await User.findByPk(Number(id), { include: { model: UserAuth, as: "auth" } });

      if (user) {
        console.log('Found: ', user.toJSON());
      } else {
        console.log('User not found by ID: ' + id);
      };
    }
  },
  authcreate: {
    question: "User ID that you'd like to assign this auth to:",
    purpose: "Create and commit to db an UserAuth, with association to a User.",
    method: async (id) => {
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
    }
  },
  bothcreate: {
    question: "Name of user, first and last name, split by a space (e.g, Steve Gates):",
    purpose: "Create and commit to db both a User and an associated UserAuth with one call.",
    method: async (name) => {
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
    }
  },

}