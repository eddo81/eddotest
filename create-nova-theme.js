#!/usr/bin/env node
/**
 * Run the entire program.
 */
const fs = require("fs-extra");
const path = require("path");
const ora = require("ora");
const prompts = require("prompts");
const { exec } = require("promisify-child-process");
const write = require("./src/utils/write.js");
const format = require("./src/utils/format.js");
const copyTpl = require("./src/utils/copyTemplateFile.js");
const argv = require("yargs").argv;

let fullThemePath = "";
let theme = {};
let templateData = {};
let counter = 1;

// Handle optional parameter args
const scriptArgs = require("minimist")(process.argv.slice(2));

/**
 * Runs before the setup for some sanity checks. (Are we in the right folder + is Composer
 * installed and available as `composer` command)
 */
const preFlightChecklist = async () => {
  // Make sure the user has called the script from wp-content/themes folder.
  /*if (path.basename(process.cwd()) !== "themes") {
    throw new Error(
      'Expected script to be called from WordPress\'s "themes" folder.'
    );
  }

  // Make sure this is in fact a WordPress install
  if (path.basename(path.join(process.cwd(), "..")) !== "wp-content") {
    throw new Error(
      'This doesn\'t seem to be a WordPress install. Please call the script from "wp-content/themes" folder.'
    );
  }*/

  // WARNING - Check if composer is installed.
  await exec("composer --version")
    .then(() => {
      // all good.
    })
    .catch(() => {
      throw new Error(
        'Unable to check Composer\'s version ("composer --version"), please make sure Composer is installed and globally available before running this script.'
      );
    });
};

/**
 * Performns a cleanup of temporary files.
 */
const cleanup = async () => {
  await fs.remove(path.join(fullThemePath, "temp"));
};

const run = async () => {
  theme = {};
  let confirmed = false;

  write.intro();

  const onCancel = prompt => {
    console.log("");
    console.log("Exiting script...");
    process.exit();
  };

  do {
    // Prompt user for all user data.
    const answers = await prompts(
      [
        {
          type: "text",
          name: "name",
          message: "Please enter your theme name (shown in WordPress admin):",
          validate: value =>
            value.length < 2
              ? `The theme name is required and must contain at least 2 characters.`
              : true
        },

        {
          type: "multiselect",
          name: "features",
          message: "Select project features:",
          choices: [
            { title: "SASS/SCSS", value: "scss", selected: true },
            {
              title: "Webpack dev server",
              value: "server",
              selected: true
            },
            { title: "PHPCS", value: "phpcs", selected: true }
          ],
          instructions: false,
          hint: "- Space to select. Return to submit."
        },

        /*{
          type: "toggle",
          name: "server",
          message:
            "Do you wish to include webpack-dev-server for local development?",
          initial: true,
          active: "yes",
          inactive: "no"
        },*/

        {
          type: prev => (prev.includes("server") === true ? "text" : null),
          name: "dev_url",
          message:
            "Please enter a theme development url (e.g. dev.wordpress.com):",
          initial: (prev, values) => `localhost/${format.dash(values.name)}/`,
          validate: value =>
            value.trim().length < 1
              ? `Dev url is required and cannot be empty.`
              : true
        },

        {
          type: "multiselect",
          name: "dependencies",
          message: "Select front-end dependencies:",
          choices: [
            { title: "jQuery", value: "jquery", selected: true },
            { title: "Vue", value: "vue" },
            { title: "Tailwind CSS", value: "tailwind" }
          ],
          instructions: false,
          hint: "- Space to select. Return to submit."
        }
      ],
      { onCancel }
    );

    // Build package name from theme name
    theme["Theme name"] = answers.name;
    theme["Folder name"] = format.dash(theme["Theme name"]);
    theme["Package name"] = format.underscore(theme["Theme name"]);
    theme["Theme prefix"] = format.prefix(theme["Theme name"]);
    theme["Namespace"] = format.capcase(theme["Package name"]);

    templateData.themeName = theme["Theme name"];
    templateData.folderName = theme["Folder name"];
    templateData.packageName = theme["Package name"];
    templateData.prefix = theme["Theme prefix"];
    templateData.namespace = theme["Namespace"];
    templateData.server = answers.features.includes("server")
      ? answers.dev_url
      : false;
    templateData.phpcs = answers.features.includes("phpcs");
    templateData.scss = answers.features.includes("scss");

    // Globally save the package (because it's also our folder name)
    fullThemePath = path.join(process.cwd(), theme["Folder name"]);

    // Display summery
    write.summary(theme);

    const confirm = await prompts(
      {
        type: "toggle",
        name: "continue",
        message: "Confirm settings to continue...",
        initial: true,
        active: "confirm",
        inactive: "cancel"
      },
      { onCancel }
    );

    confirmed = confirm.continue;

    if (confirmed !== true) {
      write.intro();
    }
  } while (confirmed !== true);

  write.letsGo();

  // -----------------------------
  //  1. Preflight checklist
  // -----------------------------

  if (scriptArgs.skipChecklist) {
    ora(`${counter}. Skipping Pre-flight checklist`)
      .start()
      .succeed();
  } else {
    const spinnerChecklist = ora("1. Pre-flight checklist").start();
    await preFlightChecklist()
      .then(() => {
        spinnerChecklist.succeed();
        counter += 1;
      })
      .catch(exception => {
        spinnerChecklist.fail();
        write.error(exception);
        process.exit();
      });
  }

  // -----------------------------
  //  2. Clone repo
  // -----------------------------

  const gitUrl = `https://github.com/eddo81/create-nova-theme.git`;

  const spinnerClone = ora(`${counter}. Cloning theme repo`).start();
  await exec(`git clone ${gitUrl} ${theme["Folder name"]}/temp`)
    .then(() => {
      spinnerClone.succeed();
      counter += 1;
    })
    .catch(exception => {
      spinnerClone.fail();
      write.error(exception);
      process.exit();
    });

  // -----------------------------
  //  3. Copy files
  // -----------------------------

  const spinnerCopy = ora(`${counter}. Copying files from temp folder`).start();
  await exec(`cd "${theme["Folder name"]}"`)
    .then(() => {
      spinnerCopy.succeed();
      counter += 1;

      fs.copySync(
        `./${theme["Folder name"]}/temp/src/templates/copy`,
        `./${theme["Folder name"]}`
      );

      copyTpl(
        `./${theme["Folder name"]}/temp/src/templates/modify/_style.css`,
        `./${theme["Folder name"]}/style.css`,
        templateData
      );

      if (templateData.server !== false) {
        copyTpl(
          `./${theme["Folder name"]}/temp/src/templates/modify/_serve.js`,
          `./${theme["Folder name"]}/build/tools/serve.js`,
          templateData
        );
      }

      if (templateData.phpcs !== false) {
        copyTpl(
          `./${theme["Folder name"]}/temp/src/templates/modify/_phpcs.xml`,
          `./${theme["Folder name"]}/phpcs.xml`,
          templateData
        );
      }

      if (argv.git) {
        copyTpl(
          `./${theme["Folder name"]}/temp/src/templates/modify/_README.md`,
          `./${theme["Folder name"]}/README.md`,
          templateData
        );
      }

      copyTpl(
        `./${theme["Folder name"]}/temp/src/templates/modify/_composer.json`,
        `./${theme["Folder name"]}/composer.json`,
        templateData
      );

      copyTpl(
        `./${theme["Folder name"]}/temp/src/templates/modify/_package.json`,
        `./${theme["Folder name"]}/package.json`,
        templateData
      );

      copyTpl(
        `./${theme["Folder name"]}/temp/src/templates/modify/_buildConfig.js`,
        `./${theme["Folder name"]}/build/tools/config/index.js`,
        templateData
      );

      copyTpl(
        `./${
          theme["Folder name"]
        }/temp/src/templates/modify/_webpack.base.conf.js`,
        `./${
          theme["Folder name"]
        }/build/tools/config/webpack/webpack.base.conf.js`,
        templateData
      );

      copyTpl(
        `./${
          theme["Folder name"]
        }/temp/src/templates/modify/_webpack.dev.conf.js`,
        `./${
          theme["Folder name"]
        }/build/tools/config/webpack/webpack.dev.conf.js`,
        templateData
      );

      copyTpl(
        `./${
          theme["Folder name"]
        }/temp/src/templates/modify/_webpack.prod.conf.js`,
        `./${
          theme["Folder name"]
        }/build/tools/config/webpack/webpack.prod.conf.js`,
        templateData
      );
    })
    .catch(exception => {
      spinnerCopy.fail();
      write.error(exception);
      process.exit();
    });

  // -----------------------------
  //  4. Cleanup
  // -----------------------------

  const spinnerCleanup = ora(`${counter}. Cleaning project folder`).start();
  await cleanup()
    .then(() => {
      spinnerCleanup.succeed();
      counter += 1;
    })
    .catch(exception => {
      spinnerCleanup.fail();
      write.error(exception);
      process.exit();
    });

  // ---------------------------------
  //  5. Install Composer dependencies
  // ---------------------------------

  if (argv.install) {
    const spinnerComposer = ora(
      `${counter}. Installing Composer dependencies`
    ).start();
    await exec(
      `cd "${fullThemePath}" && composer install --ignore-platform-reqs`
    )
      .then(() => {
        spinnerComposer.succeed();
        counter += 1;
      })
      .catch(exception => {
        spinnerComposer.fail();
        write.error(exception);
        process.exit();
      });
  }

  // -----------------------------
  //  6. Install node dependencies
  // -----------------------------

  if (argv.install) {
    const spinnerNode = ora(`${counter}. Installing Node dependencies`).start();
    await exec(`cd "${fullThemePath}" && npm install`)
      .then(() => {
        spinnerNode.succeed();
        counter += 1;
      })
      .catch(exception => {
        spinnerNode.fail();
        write.error(exception);
        process.exit();
      });
  }

  // -----------------------------
  //  7. Init git repo
  // -----------------------------

  if (argv.git) {
    const spinnerInit = ora(`${counter}. Initializing git repo`).start();
    await exec(`cd "${fullThemePath}" && git init`)
      .then(() => {
        spinnerInit.succeed();
        counter += 1;
      })
      .catch(exception => {
        spinnerInit.fail();
        write.error(exception);
        process.exit();
      });
  }

  // -----------------------------
  //  7. Success
  // -----------------------------
  write.outro(theme["Package name"]);
};

try {
  run();
} catch (error) {
  console.log(error);
  process.exit(1);
}
