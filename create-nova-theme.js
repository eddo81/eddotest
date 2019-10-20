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

let args = {
  verbose: argv.verbose || argv.v ? true : false,
  skip: argv.skip || argv.s ? true : false,
  install: argv.install || argv.i ? true : false,
  git: argv.git || argv.g ? true : false
};

let fullThemePath = "";
let counter = 1;
let theme;
let summery;

/**
 * Runs before the setup for some sanity checks. (Are we in the right folder + is Composer
 * installed and available as `composer` command)
 */
const preFlightChecklist = async () => {
  // Make sure the user has called the script from wp-content/themes folder.
  if (path.basename(process.cwd()) !== "themes") {
    throw new Error(
      'Expected script to be called from WordPress\'s "themes" folder.'
    );
  }

  // Make sure this is in fact a WordPress install
  if (path.basename(path.join(process.cwd(), "..")) !== "wp-content") {
    throw new Error(
      'This doesn\'t seem to be a WordPress install. Please call the script from "wp-content/themes" folder.'
    );
  }

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

  if (args.git) {
    // WARNING - Check if git is installed.
    await exec("git --version")
      .then(() => {
        // all good.
      })
      .catch(() => {
        throw new Error(
          'Unable to check Git\'s version ("git --version"), please make sure Git is installed and globally available before running this script.'
        );
      });
  }
};

/**
 * Performns a cleanup of temporary files.
 */
const cleanup = async () => {
  await fs.remove(path.join(fullThemePath, "temp"));
};

const run = async () => {
  theme = { args: args };

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
          type: args.verbose === true ? "text" : null,
          name: "uri",
          message: "Enter the theme's URI:"
        },

        {
          type: args.verbose === true ? "text" : null,
          name: "description",
          message: "Enter a theme's description:"
        },

        {
          type: args.verbose === true ? "text" : null,
          name: "version",
          message: "Enter the theme's version number:",
          initial: `1.0.0`,
          validate: value =>
            /^\d{1,2}\.\d{1,2}\.\d{1,2}$/.test(value) === false
              ? `Invalid version format, must be sequence of either single or doubble digits followed by a period.`
              : true
        },

        {
          type: args.verbose === true ? "list" : null,
          name: "tags",
          message: "Enter them keywords/tags:",
          initial: "",
          separator: ","
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
          choices: (prev, values) => [
            { title: "jQuery", value: "jquery", selected: true },
            { title: "Vue", value: "vue" },
            {
              title: "Tailwind CSS",
              value: "tailwind",
              disabled: !values.features.includes("scss")
            }
          ],
          instructions: false,
          hint: "- Space to select. Return to submit."
        }
      ],
      { onCancel }
    );

    theme.minWpVersion = "4.7.0";
    theme.minPhpVersion = "7.1";
    theme.themeName = answers.name;
    theme.folderName = format.dash(theme.themeName);
    theme.packageName = format.underscore(theme.themeName);
    theme.prefix = format.prefix(theme.themeName);
    theme.namespace = format.capcase(theme.packageName);
    theme.version = answers.version ? answers.version : "1.0.0";
    theme.uri = answers.uri ? answers.uri : "";
    theme.description = answers.description ? answers.description : "";
    theme.tags = answers.tags ? answers.tags : "";
    theme.year = new Date().getFullYear();
    theme.server = answers.features.includes("server")
      ? answers.dev_url
      : false;
    theme.phpcs = answers.features.includes("phpcs");
    theme.scss = answers.features.includes("scss");
    theme.tailwind = answers.features.includes("tailwind");

    // Globally save the package (because it's also our folder name)
    fullThemePath = path.join(process.cwd(), theme.folderName);

    summery = {
      "Theme name": theme.themeName,
      "Package name": theme.packageName,
      "Theme version": args.verbose ? theme.version : undefined,
      "Theme description": args.verbose ? theme.description : undefined,
      "Project features": answers.features,
      "Front-end dependencies": answers.dependencies
    };

    // Display summery
    write.summary(summery);

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

  if (args.skip) {
    ora(`${counter}. Skipping Pre-flight checklist`)
      .start()
      .succeed();
    counter += 1;
  } else {
    const spinnerChecklist = ora(`${counter}. Pre-flight checklist`).start();
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
  await exec(`git clone ${gitUrl} ${theme.folderName}/temp`)
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
  await exec(`cd "${theme.folderName}"`)
    .then(() => {
      spinnerCopy.succeed();
      counter += 1;

      fs.copySync(
        `./${theme.folderName}/temp/src/templates/copy`,
        `./${theme.folderName}`
      );

      copyTpl(
        `./${theme.folderName}/temp/src/templates/modify/_style.css`,
        `./${theme.folderName}/style.css`,
        theme
      );

      copyTpl(
        `./${theme.folderName}/temp/src/templates/modify/_functions.php`,
        `./${theme.folderName}/functions.php`,
        theme
      );

      copyTpl(
        `./${theme.folderName}/temp/src/templates/modify/_MIT.txt`,
        `./${theme.folderName}/LICENSE.txt`,
        theme
      );

      if (theme.server !== false) {
        copyTpl(
          `./${theme.folderName}/temp/src/templates/modify/_serve.js`,
          `./${theme.folderName}/build/tools/serve.js`,
          theme
        );
      }

      if (theme.phpcs !== false) {
        copyTpl(
          `./${theme.folderName}/temp/src/templates/modify/_phpcs.xml`,
          `./${theme.folderName}/phpcs.xml`,
          theme
        );
      }

      if (theme.scss !== false) {
        fs.copySync(
          `./${theme.folderName}/temp/src/templates/modify/_scss`,
          `./${theme.folderName}/build/scss`
        );

        copyTpl(
          `./${theme.folderName}/temp/src/templates/modify/_index.scss`,
          `./${theme.folderName}/build/scss/index.scss`,
          theme
        );
      }

      if (args.git) {
        copyTpl(
          `./${theme.folderName}/temp/src/templates/modify/_README.md`,
          `./${theme.folderName}/README.md`,
          theme
        );
      }

      copyTpl(
        `./${theme.folderName}/temp/src/templates/modify/_vsCodeSettings.json`,
        `./${theme.folderName}/.vscode/settings.json`,
        theme
      );

      copyTpl(
        `./${theme.folderName}/temp/src/templates/modify/_composer.json`,
        `./${theme.folderName}/composer.json`,
        theme
      );

      copyTpl(
        `./${theme.folderName}/temp/src/templates/modify/_package.json`,
        `./${theme.folderName}/package.json`,
        theme
      );

      copyTpl(
        `./${theme.folderName}/temp/src/templates/modify/_buildConfig.js`,
        `./${theme.folderName}/build/tools/config/index.js`,
        theme
      );

      copyTpl(
        `./${theme.folderName}/temp/src/templates/modify/_webpack.base.conf.js`,
        `./${theme.folderName}/build/tools/webpack/webpack.base.conf.js`,
        theme
      );

      copyTpl(
        `./${theme.folderName}/temp/src/templates/modify/_webpack.dev.conf.js`,
        `./${theme.folderName}/build/tools/webpack/webpack.dev.conf.js`,
        theme
      );

      copyTpl(
        `./${theme.folderName}/temp/src/templates/modify/_webpack.prod.conf.js`,
        `./${theme.folderName}/build/tools/webpack/webpack.prod.conf.js`,
        theme
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

  if (args.install) {
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

  if (args.install) {
    const spinnerNode = ora(`${counter}. Installing NPM dependencies`).start();
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

  if (args.git) {
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
  write.outro(theme.folderName, args.install);
};

try {
  run();
} catch (error) {
  console.log(error);
  process.exit(1);
}
