# Contributing

Thanks for being here and for being awesome! 👍

The following sections outline the different ways to contribute to the project.

## :mega: Discussing

The easiest way to contribute to the project is by participating in discussions on the [SaladChefs Discord server](https://discord.gg/salad) or in the [SaladChefs Subreddit](https://www.reddit.com/r/SaladChefs/). The community often chimes in with helpful advice when you have a question, and you may also find yourself providing answers and helping others. Be sure to review the [code of conduct](./CODE_OF_CONDUCT.md) before participating.

You can create a [support ticket](https://support.salad.com/article/216-how-to-create-a-support-ticket) if you have a specific question that should be answered by a team member.

_Please do not use GitHub issues to ask a question._ We will politely close a GitHub issue that asks a question and kindly refer you to one of the aforementioned avenues.

## :bug: Reporting Bugs

We're sorry if this happened to you! Consider jumping into the `#community-support` channel on the [SaladChefs Discord server](https://discord.gg/salad) or the "Community Support" category in the [SaladChefs Subreddit](https://www.reddit.com/r/SaladChefs/) first. The community may have already found a solution.

You can create a [support ticket](https://support.salad.com/article/216-how-to-create-a-support-ticket) to report bugs or if you have a specific question that should be answered by a team member.

## :sparkles: Requesting Features

We love a good idea. Do you have one? Consider jumping into the `#feature-requests` channel on the [SaladChefs Discord server](https://discord.gg/salad) or the "Feature Requests" category in the [SaladChefs Subreddit](https://www.reddit.com/r/SaladChefs/) first. The community may have some interesting insights.

## :rotating_light: Reporting Security Vulnerabilities

We take security seriously, and we appreciate your cooperation in disclosing vulnerabilities to us responsibly. Refer to our [security policy](./SECURITY.md) for more details.

_Please do not use public GitHub issues to report a security vulnerability._

## :octocat: Changing Code

Interested in changing the world?

First, identify the scale of your proposed changes. If it is a small change, such as to fix grammar or spelling, feel free to start working on a fix. However, if it is a feature or substantial code contribution, please discuss it with the team first to ensure it fits in the product roadmap.

You can propose code changes by submitting GitHub pull requests. The code changes are expected to fit existing code styles and conventions. Using Visual Studio Code with the recommended extensions should minimize any manual work associated with code styles (see [Setting Up a Development Environment](#setting-up-a-development-environment)).

Additionally, please consider taking a moment to read Miguel de Icaza's blog post titled [Open Source Contribution Etiquette](https://tirania.org/blog/archive/2010/Dec-31.html) and Ilya Grigorik's blog post titled [Don't "Push" Your Pull Requests](https://www.igvita.com/2011/12/19/dont-push-your-pull-requests/).

### Setting Up a Development Environment

First, you're going to need a few development tools:

- [Git](https://www.git-scm.com/)
- [nvm](https://github.com/nvm-sh/nvm) (if you're on Linux or macOS) or [NVM for Windows](https://github.com/coreybutler/nvm-windows) (if you're on Windows)
- [Visual Studio Code](https://code.visualstudio.com/)

We try to stay on the latest, stable versions of these tools, and we recommend that you choose to do the same. We will be unable to provide technical support for these tools, and old versions may not work with our project configuration.

Next, launch Visual Studio Code and install the following essential extensions:

- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ZipFS](https://marketplace.visualstudio.com/items?itemName=arcanis.vscode-zipfs)

Refer to the [Visual Studio Code documentation](https://code.visualstudio.com/docs/editor/extension-gallery) for help finding and installing these extensions.

### Setting Up the Project

First, you're going to need to clone the repository.

In your favorite terminal, change the current working directory to a location suitable for storing the repository. Then run the following:

```sh
git clone git@github.com:SaladTechnologies/salad-applications.git
```

Next, use nvm (if you're on Linux or macOS) or NVM for Windows (if you're on Windows) to install the required version of Node.js.

In a Bash terminal on Linux or macOS, change the current working directory to the location of the cloned project and install Node.js using nvm:

```bash
cd salad-applications/packages/web-app
nvm install
nvm use
```

In a Command Prompt terminal on Windows, change the current working directory to the location of the cloned project and install Node.js using NVM for Windows:

```cmd
cd salad-applications\packages\web-app
set /p node_version= < .nvmrc
nvm install %node_version%
nvm use %node_version%
```

In a PowerShell terminal on Windows, change the current working directory to the location of the cloned project and install Node.js using NVM for Windows:

```ps
Set-Location -Path salad-applications\packages\web-app
$NodeVersion = Get-Content .nvmrc
& nvm install $NodeVersion
& nvm use $NodeVersion
```

Next, restore the project dependencies and tooling.

```sh
yarn install
```

Finally, open the project in Visual Studio Code. Use `Ctrl+Shift+P` to open the command palette. Choose the "Select TypeScript Version" command, and choose the "Use Workspace Version" option.
