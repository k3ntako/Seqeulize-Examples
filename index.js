const commands = require('./commands');



const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const commandFuncWrapper = async (func, input) => {
  try {
    await func(input);
  } catch (error) {
    console.error(error);
  }

  setTimeout(start, 1000);
}

const start = async () => {
  console.log("\n------ New Task ------\n");
  
  rl.question("What is your command? UserCreate, AuthCreate, UserFindByPk, BothCreate \n", function (commandStr) {
    const command = commands[commandStr.toLowerCase()];

    rl.question(command.question + " \n", (input)  => {
      commandFuncWrapper(command.method, input)
    });

  });
}

rl.on("close", function () {
  console.log("\nClosing...");
  process.exit(0);
});

start(); // start program