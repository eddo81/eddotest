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

function outro(folderName, hasInstalled = false) {
  console.log("");
  console.log(`Your theme is now ready!`);
  console.log("");

  if (hasInstalled === true) {
    console.log(
      `Please ${chalk.green("cd")} into the ${chalk.green(
        `${folderName}`
      )} folder and run ${chalk.green("npm start")} to start developing.`
    );
  }

  if (hasInstalled === false) {
    console.log(
      `Please ${chalk.green("cd")} into the ${chalk.green(
        `${folderName}`
      )} folder and run ${chalk.green("composer install")} and ${chalk.green(
        "npm install"
      )}.\nAfter the required dependencies have been installed run ${chalk.green(
        "npm start"
      )} to start developing.`
    );
  }

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

function summary(summery) {
  success("");
  success("The theme details are as follows:");
  Object.keys(summery).forEach(key => {
    if (summery[key]) {
      console.log(`${chalk(key)}: ${chalk.green(summery[key])}`);
    }
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
