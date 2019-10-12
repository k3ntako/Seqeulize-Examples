const crypto = require('crypto');
const db = require('./sequelize/models');
const User = db.User;
const UserAuth = db.UserAuth;


const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const query = async () => {
  console.log("\n------ New Query ------\n");
  
  // console.log(process.memoryUsage());
  
  rl.question("What is your command? UserCreate, UserAuthCreate, UserFindByPk \n", function (commandStr) {
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

query();

const commands = {
  usercreate: {
    question: "Name of user, first and last name, split by a space (e.g, Steve Gates):",
    callback: async (name, cb) => {
      try {
        const names = name.split(" ");
        const firstName = names[0] && names[0].trim() || "Steve";
        const lastName = names[1] && names[1].trim() || "Gates";
        
        const user = await User.create({
          firstName: firstName,
          lastName: lastName,
          email: firstName + lastName + "@example.com",
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
        const user = await User.findByPk(Number(id), { include: { model: UserAuth, as: "auth", raw: true, }});
        
        if (user){
          console.log('Found: ', user.dataValues)
        }else{
          console.log('User not found by ID: ' + id)
        };

        cb();
      } catch (error) {
        console.error(error);
      }
    }
  },
  userauthcreate: {
    question: "User ID that you'd like to assign this auth to:",
    callback: async (id, cb) => {
      try {
        const salt = crypto.randomBytes(16).toString('hex');
        const user = await User.findByPk(Number(id));

        if( !user ) throw new Error("No user with that id: " + id);
        
        const userAuth = await UserAuth.create({
          user_id: user.id,
          passhash: crypto.pbkdf2Sync("password", salt, 1000, 64, `sha512`).toString(`hex`),
          salt: salt,
        }, {
          include: [User]
        });

        if (userAuth) console.log('Created: ', userAuth.dataValues);
        
        cb();
      } catch (error) {
        console.error(error);
      }
    }
  }
  
}