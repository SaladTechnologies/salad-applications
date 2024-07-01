# Salad Web App

The Salad web app is the primary web-based UI that allows users to interact with their Salad profile and the Salad storefront. The Salad web app is a [Typescript](https://www.typescriptlang.org/) application built with [React](https://reactjs.org/) and [MobX](https://mobx.js.org/).

## Getting Started

To run the web app in development mode, run the following:

```sh
yarn start
```

The web app will be available at <http://localhost:3000/> and automatically refresh when changes are detected. Debugging from Visual Studio Code is available if you run via one of the `Launch & Debug` tasks.

To run Storybook for UI component development, run the following:

```sh
yarn storybook
```

Storybook will be available at <http://localhost:9001/> and automatically refresh when any changes are detected.

## Architecture

Each feature is broken into 2 (or more) separate modules, 1 for the UI components and 1 for the business logic and API integration.

### State Management

Each feature has 1 or more MobX stores that is accessed by the `RootStore`, allowing each store to easily access other stores. Each UI component should be a "Pure Component" that simply render the state that is passed into them and eliminating any internal state within the component. A common exception for this rule are forms which keep state internal to the component while the user is filling in the form, and then calling the MobX store once the form has been submitted.

## Frameworks and Libraries

- [React JS](https://reactjs.org/) - A declarative, efficient, and flexible JavaScript library for building user interfaces.
- [MobX](https://mobx.js.org/) - Simple, scalable state management.
- [Axios](https://github.com/axios/axios) - Promise based HTTP client for the browser and node.js
- [Storybook](https://storybook.js.org/) - Storybook is a development environment for UI components.
- [JSS](https://cssinjs.org) - JSS is an authoring tool for CSS which allows you to use JavaScript to describe styles in a declarative, conflict-free and reusable way.
- [Typescript](https://www.typescriptlang.org/) - A language for application-scale JavaScript.


## Machines API Client

Do the following steps to run the web-app with latest updated Kiota Machines API Client:
1. Generate TypeScript client code - [find instruction here](https://github.com/SaladTechnologies/salad-platform/tree/master/backend/src/OpenAPI/MachinesAPI)
2. `output` folder (`salad-platform\backend\src\OpenAPI\MachinesAPI\output`) contains all the generate Machines API Client files
3. copy files from the `output` folder and paste (replace everything) in the web-app project here `salad-applications\packages\web-ap\src\api\machinesApiClient\generated`
4. try to run the project with `yarn start`, there probably will be errors
5. resolve all errors manually
6. `yarn start`
