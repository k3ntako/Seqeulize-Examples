const commands = require('./commands');


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
      command.callback(input, () => setTimeout(start, 1000));
    });

  });
}

rl.on("close", function () {
  console.log("\nClosing...");
  process.exit(0);
});

start(); // start program