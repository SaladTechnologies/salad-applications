# Salad Web Application

The Salad Web Application is the primary UI that allows users to interact with Salad. The Salad Web Application is a [Typescript](https://www.typescriptlang.org/) build with [React](https://reactjs.org/) and [MobX](https://mobx.js.org/)

## Getting Started

To run the Web Application in development mode run

```
yarn start
```

Salad UI will now be available at http://localhost:3000/ and automatically refresh when any changes are detected. Debugging is available if you run via the included VSCode launch task `Debug Web App`.

While doing UI component development it is recommended to us [Storybook](https://storybook.js.org/).

```
yarn storybook
```

Storybook will now be available at http://localhost:9001/ and automatically refresh when any changes are detected.

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
