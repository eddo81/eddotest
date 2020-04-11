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
const validURL = require("./src/utils/vaildURL.js");
const copyTpl = require("./src/utils/copyTemplateFile.js");
const argv = require("yargs").argv;
const glob = require("glob");
const wpPot = require('wp-pot');

let args = {
  verbose: argv.verbose || argv.v ? true : false,
  skip: argv.skip || argv.s ? true : false,
  install: argv.install || argv.i ? true : false,
  git: argv.git || argv.g ? true : false,
  plugin: argv.plugin || argv.p ? true : false
};

let fullProjectPath = "";
let projectType = (args.plugin) ? 'plugin' : 'theme';
let counter = 1;
let data;
let summery;
let defaultLicense = {
  type: 'MIT',
  url: 'https://opensource.org/licenses/MIT'
};

/**
 * Runs before the setup for some sanity checks. (Are we in the right folder + is Composer
 * installed and available as `composer` command)
 */
const preFlightChecklist = async () => {
  // Make sure the user has called the script from wp-content/themes or wp-content/plugins folder.
  let projectFolderName = `${projectType}s`;

  if (path.basename(process.cwd()) !== projectFolderName) {
    throw new Error(
      `Expected script to be called from WordPress's "${projectFolderName}" folder.`
    );
  }

  // Make sure this is in fact a WordPress install
  if (path.basename(path.join(process.cwd(), "..")) !== "wp-content") {
    throw new Error(
      `This doesn't seem to be a WordPress install. Please call the script from "wp-content/${projectFolderName}" folder.`
    );
  }

  // Check for existing theme/plugin folders with the same name
  if (fs.existsSync(fullProjectPath) === true) {
    throw new Error(
      `A folder with the name "${data.folderName}" already exists at this location. Please select a different name for your theme and try again.`
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
  await fs.remove(path.join(fullProjectPath, "temp"));
};

const pot = async (data) => {
  await wpPot({
    destFile: `./${data.folderName}/languages/${data.packageName}.pot`,
    domain: data.textDomain,
    package: data.packageName,
    src: `./${data.folderName}/**/*.php`
  });
}

const run = async () => {
  data = { args: args };

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
          type: args.verbose === true ? "text" : null,
          name: "authorName",
          message: `Please enter the name of the ${projectType} author:`,
        },

        {
          type: args.verbose === true ? "text" : null,
          name: "authorEmail",
          message: `Please enter the author email:`,
          validate: (value) => {
            if (value === '') {
              return true;
            } else {
              return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) === false) ? `You have entered an invalid email address!` : true
            }
          }
        },

        {
          type: args.verbose === true ? "text" : null,
          name: "authorUrl",
          message: `Please enter the author url:`,
          validate: (value) => {
            if (value === '') {
              return true;
            } else {
              return (validURL(value) === false) ? `You have entered an invalid URL!` : true
            }
          }
        },

        {
          type: "text",
          name: "name",
          message: `Please enter your ${projectType} name (shown in WordPress admin):`,
          validate: value =>
            value.length < 2
              ? `The project name is required and must contain at least 2 characters.`
              : true
        },

        {
          type: args.verbose === true ? "text" : null,
          name: "uri",
          message: `Enter the ${projectType}'s URI:`,
          validate: (value) => {
            if (value === '') {
              return true;
            } else {
              return (validURL(value) === false) ? `You have entered an invalid URI!` : true
            }
          }
        },

        {
          type: args.verbose === true ? "text" : null,
          name: "description",
          message: `Enter the ${projectType}'s description:`,
        },

        {
          type: args.verbose === true ? "text" : null,
          name: "version",
          message: `Enter the ${projectType}'s version number:`,
          initial: `1.0.0`,
          validate: value =>
            /^\d{1,2}\.\d{1,2}\.\d{1,2}$/.test(value) === false
              ? `Invalid version format, must be sequence of either single or doubble digits followed by a period.`
              : true
        },

        {
          type: args.verbose === true ? "list" : null,
          name: "tags",
          message: `Enter the ${projectType} keywords/tags:`,
          initial: "",
          separator: ","
        },

        {
          type: args.verbose === true ? "select" : null,
          name: "license",
          message: `Select which type of license you would like to use for this ${projectType}:`,
          choices: [
            {
              title: "MIT",
              value: {
                type: "MIT",
                url: "https://opensource.org/licenses/MIT"
              }
            },
            {
              title: "Apache-2.0",
              value: {
                type: "Apache-2.0",
                url: "https://opensource.org/licenses/Apache-2.0"
              }
            },
            {
              title: "GPLv3",
              value: {
                type: "GPLv3",
                url: "https://opensource.org/licenses/GPL-3.0"
              }
            },
          ],
          initial: 1
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
            "Please enter a development url (e.g. dev.wordpress.com):",
          initial: (prev, values) => `localhost/${format.dash(values.name)}/`,
          validate: value =>
            value.trim().length < 1
              ? `Dev url is required and cannot be empty.`
              : true
        },

        {
          type: "multiselect",
          name: "jslibs",
          message: "Select javascript dependencies:",
          choices: (prev, values) => [
            { title: "jQuery", value: "jquery", selected: true },
            { title: "Vue", value: "vue" }
          ],
          instructions: false,
          hint: "- Space to select. Return to submit."
        },

        {
          type: "select",
          name: "csslibs",
          message: "Select a css library:",
          choices: [
            { title: "None", value: "none", selected: true },
            { title: "Tailwind CSS", value: "tailwind" },
            { title: "Cutestrap", value: "cutestrap" },
            { title: "Bulma", value: "bulma" }
          ],
          initial: 1
        }
      ],
      { onCancel }
    );

    data.minWpVersion = "4.7.0";
    data.minPhpVersion = "7.1";
    data.projectType = projectType;
    data.author = {
      name: answers.authorName ? answers.authorName : '',
      email: answers.authorEmail ? answers.authorEmail : '',
      url: answers.authorUrl ? answers.authorUrl : '',
      full: answers.authorName ? `${answers.authorName}${answers.authorEmail ? ' <' + answers.authorEmail + '>' : ''}${answers.authorUrl ? ' (' + answers.authorUrl + ')' : ''}` : ''
    };
    data.projectName = answers.name;
    data.folderName = format.dash(data.projectName);
    data.packageName = format.underscore(data.projectName);
    data.prefix = format.prefix(data.projectName);
    data.namespace = format.capcase(data.packageName);
    data.textDomain = format.dash(data.projectName.toLowerCase());
    data.version = answers.version ? answers.version : "1.0.0";
    data.uri = answers.uri ? answers.uri : "";
    data.description = answers.description ? answers.description : "";
    data.tags = answers.tags ? answers.tags : "";
    data.year = new Date().getFullYear();
    data.license = answers.license ? answers.license : defaultLicense;
    data.server = answers.features.includes("server") ? answers.dev_url : false;
    data.phpcs = answers.features.includes("phpcs");
    data.scss = answers.features.includes("scss");
    data.styles = data.scss !== false ? "scss" : "css";
    data.jquery = answers.jslibs.includes("jquery");
    data.vue = answers.jslibs.includes("vue");
    data.bulma = answers.csslibs === "bulma";
    data.cutestrap = answers.csslibs === "cutestrap";
    data.tailwind = answers.csslibs === "tailwind";

    // Globally save the package (because it's also our folder name)
    fullProjectPath = path.join(process.cwd(), data.folderName);

    summery = {
      "Project name": data.projectName,
      "Package name": data.packageName,
      "Project version": args.verbose ? data.version : undefined,
      "Project description": args.verbose ? data.description : undefined,
      "Project licence": data.license.type,
      "Project features": answers.features,
      "Front-end dependencies": answers.jslibs.concat([answers.csslibs]),
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

  const spinnerClone = ora(`${counter}. Cloning ${projectType} repo`).start();
  await exec(`git clone ${gitUrl} ${data.folderName}/temp`)
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
  await exec(`cd "${data.folderName}"`)
    .then(() => {
      spinnerCopy.succeed();
      counter += 1;

      let common = glob.sync(`./${data.folderName}/temp/src/templates/common/copy/**/*.*`);
      let project = glob.sync(`./${data.folderName}/temp/src/templates/${projectType}/copy/**/*.*`);
      let files = common.concat(project);

      files.forEach(templateFile => {
        let toFile = (templateFile.endsWith('.ejs') === true) ? templateFile.substring(0, templateFile.length - 4) : templateFile;
        console.log(toFile);
        copyTpl(templateFile, toFile, data);
      });

      fs.copySync(
        `./${data.folderName}/temp/src/templates/${projectType}/copy`,
        `./${data.folderName}`,
        {
          filter: n => {
            return !n.endsWith('.ejs');
          }
        }
      );

      copyTpl(
        `./${data.folderName}/temp/src/templates/${projectType}/modify/licenses/_${data.license.type}.txt`,
        `./${data.folderName}/LICENSE.txt`,
        data
      );

      copyTpl(
        `./${data.folderName}/temp/src/templates/${projectType}/modify/_index.${data.styles}`,
        `./${data.folderName}/build/styles/index.${data.styles}`,
        data
      );

      copyTpl(
        `./${data.folderName}/temp/src/templates/${projectType}/modify/_utilities.css`,
        `./${data.folderName}/build/styles/utilities/_utilities.${data.styles}`,
        data
      );

      copyTpl(
        `./${data.folderName}/temp/src/templates/${projectType}/modify/_base.css`,
        `./${data.folderName}/build/styles/base/_base.${data.styles}`,
        data
      );

      if (data.server !== false) {
        copyTpl(
          `./${data.folderName}/temp/src/templates/${projectType}/modify/_serve.js`,
          `./${data.folderName}/build/tools/serve.js`,
          data
        );
      }

      if (data.phpcs !== false) {
        copyTpl(
          `./${data.folderName}/temp/src/templates/${projectType}/modify/_phpcs.xml`,
          `./${data.folderName}/phpcs.xml`,
          data
        );
      }

      if (data.phpcs !== false) {
        copyTpl(
          `./${data.folderName}/temp/src/templates/${projectType}/modify/_settings.json`,
          `./${data.folderName}/.vscode/settings.json`,
          data
        );
      }

      if (data.scss !== false) {
        fs.copySync(
          `./${data.folderName}/temp/src/templates/${projectType}/modify/_scss_resources`,
          `./${data.folderName}/build/styles/resources`
        );
      }

      if (data.tailwind !== false) {
        copyTpl(
          `./${data.folderName}/temp/src/templates/${projectType}/modify/_tailwind.js`,
          `./${data.folderName}/build/styles/tailwind.js`,
          data
        );
      }

      if (data.vue !== false) {
        fs.copySync(
          `./${data.folderName}/temp/src/templates/${projectType}/modify/_vue`,
          `./${data.folderName}/build/scripts/vue`
        );
      }
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
  //  5. Create language file
  // ---------------------------------

  const spinnerPot = ora(`${counter}. Generating Pot file`).start();
  await pot(data)
    .then(() => {
      spinnerPot.succeed();
      counter += 1;
    })
    .catch(exception => {
      spinnerPot.fail();
      write.error(exception);
      process.exit();
    });

  // ---------------------------------
  //  6. Install Composer dependencies
  // ---------------------------------

  if (args.install) {
    const spinnerComposer = ora(
      `${counter}. Installing Composer dependencies`
    ).start();
    await exec(
      `cd "${fullProjectPath}" && composer install --ignore-platform-reqs`
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
  //  7. Install node dependencies
  // -----------------------------

  if (args.install) {
    const spinnerNode = ora(`${counter}. Installing NPM dependencies`).start();
    await exec(`cd "${fullProjectPath}" && npm install`)
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
  //  8. Init git repo
  // -----------------------------

  if (args.git) {
    const spinnerInit = ora(`${counter}. Initializing git repo`).start();
    await exec(`cd "${fullProjectPath}" && git init`)
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
  //  9. Success
  // -----------------------------
  write.outro(data.folderName, args.install);
};

try {
  run();
} catch (error) {
  console.log(error);
  process.exit(1);
}
