// Write
const figlet = require("figlet");
const chalk = require("chalk");

function intro() {
  process.stdout.write("\u001b[2J\u001b[0;0H");
  console.log(chalk.cyan(figlet.textSync("Create Nova Theme ")));
  console.log(
    " You're about to run the setup script for your theme in this directory:"
  );
  console.log(chalk.red(""));
  success(` ${process.cwd()} `);
  console.log(chalk.red(""));
}

function outro(package) {
  console.log("");
  console.log(`Your theme is now ready!`);
  console.log("");
  console.log(
    `Please go to theme's folder (${chalk.green(
      `cd ${package}`
    )}) and run ${chalk.green("npm start")} to start developing.`
  );
  console.log("");
}

function letsGo() {
  console.log("");
  console.log("Let's get started, it might take a while...");
  console.log("");
}

function label(msg) {
  console.log(chalk.cyan(msg));
}

function error(msg) {
  console.log(`${chalk.bgRed("Error")}${chalk.red(" - ")}${msg}`);
}

function success(msg) {
  console.log(`${chalk.bgGreen(chalk.black(msg))}`);
}

function summary(answers) {
  success("");
  success("Your details will be:");
  Object.keys(answers).forEach(key => {
    console.log(`${chalk(key)}: ${chalk.green(answers[key])}`);
  });
  success("");
}

module.exports = {
  intro,
  outro,
  letsGo,
  label,
  error,
  success,
  summary
};