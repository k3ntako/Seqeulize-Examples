const crypto = require('crypto');
const db = require('./sequelize/models');
const User = db.User;
const UserAuth = db.UserAuth;


const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const start = async () => {
  console.log("\n------ New Task ------\n");
  
  rl.question("What is your command? UserCreate, AuthCreate, UserFindByPk, BothCreate \n", function (commandStr) {
    const command = commands[commandStr.toLowerCase()];

    rl.question(command.question + " \n", (input)  => {
      command.callback(input, () => setTimeout(query, 1000));
    });

  });
}



rl.on("close", function () {
  console.log("\nClosing...");
  process.exit(0);
});

start(); // start program

const parseName = ( name ) => {
  const names = name.split(" ");
  const firstName = names[0] && names[0].trim() || "Steve";
  const lastName = names[1] && names[1].trim() || "Gates";
  const email = (firstName + lastName + "@example.com").toLowerCase();
  return [ firstName, lastName, email ];
}

const commands = {
  usercreate: {
    question: "Name of user, first and last name, split by a space (e.g, Steve Gates):",
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
    callback: async (id, cb) => {
      try {
        const user = await User.findByPk(Number(id), { include: { model: UserAuth, as: "auth" }});
        
        if (user){
          console.log('Found: ', user.toJSON());
        }else{
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
    callback: async (id, cb) => {
      try {
        const user = await User.findByPk(Number(id));
        if( !user ) throw new Error("No user with that id: " + id);

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