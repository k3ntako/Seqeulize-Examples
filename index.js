const commands = require('./commands');
let commandNames = "";
let i = 0;
for( let key in commands ){
  commandNames += `${commands[key].name} (${i}), `;
  i++;
};


const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const commandFuncWrapper = async (func, input) => {
  try {
    await func(input);
  } catch (error) {
    console.error("Threw error: ", error);
  }

  setTimeout(start, 1000);
}

const start = async () => {
  console.log("\n------ New Task ------\n");
  
  rl.question(`What is your command? ${commandNames} \n`, function (commandStr) {
    try{
      const command = commands[commandStr.toLowerCase()];

      rl.question(command.question + " \n", (input) => {
        commandFuncWrapper(command.method, input)
      });
    }catch(err){
      console.error(`${commandStr} is not a command:`);
      setTimeout(start, 1000);
    }
  });
}

rl.on("close", function () {
  console.log("\nClosing...");
  process.exit(0);
});

start(); // start program