# Salad

<p align="center">
    <a href="https://app.netlify.com/sites/salad-web-app/deploys"><img src="https://api.netlify.com/api/v1/badges/fce3950b-4efe-43db-9242-37d3204b7ce1/deploy-status" /></a> <a href="https://discord.gg/xcvmgQk"><img src="https://img.shields.io/badge/discord-join-7289DA.svg?logo=discord&longCache=true&style=flat" /></a>
</p>

---

## Intro

<center>
  <img src="./docs/banner.png" width="100%" />
</center>

Salad allows PC gamers to monetize latent computer time in return for digital goods and physical items - gamers can convert PC idle-time into things they love, like games, gift cards, downloadable content, subscriptions, donations, hardware and more. Most gamers use their computers less than two hours per day, but with Salad their PC is value-adding 24/7!

To support this mission of generating useful content from idle computer time, we [mine for cryptocurrency](https://www.salad.io/blog/a-gamers-guide-to-blockchain-and-crypto/). Specifically, we use [GMiner](https://github.com/develsoftware/GMinerRelease/releases) to mine [BEAM](https://beam.mw/mining) and [Ethminer](https://github.com/ethereum-mining/ethminer) to mine in support of the [Ethereum](https://ethereum.org/) network.

**Table of contents**

- 🚀 [Getting Started](#getting-started)
- 📒 [Projects](#projects)
- 👥 [Community](#community)
- 👨‍💻 [Development scripts](#development-scripts)
- 👏 [Contributing](#contributing)
- 🐛 [Bug Bounty](#bug-bounty)

## Getting Started

Salad uses [Lerna](https://lerna.js.org/) and [Yarn](https://yarnpkg.com/en/) to manage dependencies for the projects.

First check out the repository to your machine. Then install dependencies via Yarn.

```
cd salad-apps
yarn bootstrap
```

Build all the projects. Please check the [projects](#projects) for details for specific projects.

```
yarn build
```

## Projects

| Project                             | Directory            | Description                                                                                                                          |
| ----------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [Desktop App](packages/desktop-app) | packages/desktop-app | The primary Electron application that users install on their machines. Include all miners and high performance computing libraries.  |
| [Web App](packages/web-app)         | packages/web-app     | The primary UI that users interact with when using Salad. Available via the Desktop App or at [app.salad.io](https://app.salad.io/). |

## Community

- Tweeting via [@saladtech](https://twitter.com/saladtech)
- Posting on [@salad.tech](https://www.instagram.com/salad.tech)
- Blogging at [Medium](https://medium.com/@saladchefs)
- Chatting on [Discord](https://discord.gg/xcvmgQk)

## Development scripts

Storybook is organized as a monorepo using [Lerna](https://lernajs.io). Useful scripts include:

#### `yarn bootstrap`

> Installs package dependencies and links packages together - using lerna

#### `yarn build`

> Builds all projects in production mode - using lerna

#### `yarn start`

> Starts all projects in development mode - using lerna

## Contributing

We welcome contributions to Storybook!

- 📥 Pull requests and 🌟 Stars are always welcome.
- Read our [contributing guide](CONTRIBUTING.md) to get started.

- [Talk to us](https://discord.gg/xcvmgQk), we'll find something to suits your skills and learning interest.

## Bug Bounty

Salad is committed to building and protecting the world's most trusted way to monetize idle compute time. If you believe you have discovered a bug or potential security vulnerability, we will gladly compensate you with some 💰💰💰 for disclosing the issue to us. Please submit a GitHub [issue](https://github.com/SaladTechnologies/salad-applications/issues) any details to help us reproduce and squash the bug.
