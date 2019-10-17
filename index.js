const commands = require('./commands');
const commandNamesArr = Object.keys(commands);
const commandNames = commandNamesArr.map((key, idx) => `${commands[key].name} (${idx})`).join(", ");

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const commandFuncWrapper = async (func, input) => {
  try {
    console.log("");
    await func(input);
  } catch (error) {
    console.error("Threw error: ", error);
  }

  setTimeout(start, 1000);
}

const start = async () => {
  console.log("\n------ New Task ------\n");
  
  rl.question(`What is your command? ${commandNames} \n`, function (userInput) {
    try{
      let command;
      const parsedUserInput = userInput.trim().toLowerCase();

      const commandIdx = Number(parsedUserInput);
      if ( commandIdx || commandIdx === 0 ){
        const commandKey = commandNamesArr[commandIdx];
        command = commands[commandKey];
      }else{
        command = commands[parsedUserInput];
      }

      console.log(`\nRunning ${command.name}...`);

      rl.question(command.question + " \n", (input) => {
        commandFuncWrapper(command.method, input)
      });
    }catch(err){
      console.error(`${userInput} is not a command.`);
      setTimeout(start, 1000);
    }
  });
}

rl.on("close", function () {
  console.log("\nClosing...");
  process.exit(0);
});

start(); // start program