const crypto = require('crypto');
const db = require('./sequelize/models');
const User = db.User;
const UserAuth = db.UserAuth;
const Course = db.Course;
const { parseName } = require('./utilities');

module.exports = {
  usercreate: {
    name: "userCreate",
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
    name: "userFindByPk",
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
  authfindbyuserid: {
    name: "authFindByUserId",
    question: "User ID:",
    purpose: "Find user by primary key (pk) and return User and associated UserAuth.",
    method: async (id) => {
      const user = await User.findByPk(Number(id));
      const auth = await user.getAuth();

      if (auth) {
        console.log('Found: ', auth.toJSON());
      } else {
        console.log('Could not find Auth for user with ID: ' + id);
      };
    }
  },
  authcreate: {
    name: "authCreate",
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
    name: "bothCreate",
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