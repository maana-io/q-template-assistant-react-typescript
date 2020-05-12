# Maana Q Assistant Template (Basic)

Basic template for a create-react-app to be used as a maana Q assistant.

## What's inside?

- React App
- Maana Q Assistant Client npm library installed
- `.env` file with example variable printed in console (set in `Dockerfile`)
- `Dockerfile`
- nginx conf
- Build/Run/Watch scripts

## Default Functionality

- Gets the current workspace.
- Get the active graph from the workspace.
- Creates a Function.
- Adds the function as a node to the active graph in the workspace.

## Resources

- Hooks
  - [useHooks.com](https://usehooks.com/) - advanced React Hooks examples
- Environment variables
  - [Adding Custom Environment Variables (CRA)](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- React + TypeScript
  - [Getting Started with TypeScript and React (CRA)](https://create-react-app.dev/docs/adding-typescript/#getting-started-with-typescript-and-react)
- GraphQL Schema to TypeScript defitions
  - [GraphQL Code Generator](https://graphql-code-generator.com/)

## Development

As with any Node application, you must first install dependencies:

```sh
# install dependencies
npm i

# start watch mode, server, and tunnel service
npm run start
```

`npm run start` will log a URL to the console (your tunnel endpoint); copy this and register it with your instance of Q (see [Registring a Custom Service](https://maana.gitbook.io/q/v/3.2.1/maana-q-cookbook/basic-ingredients/11-publish-knowledge-services)).

## Deployment:

Docker or local

1. Docker:
    ```sh
    # build docker image
    sh dockerBuild.sh

    # start image
    sh dockerRun.sh
    ```
1. Local
    ```sh
    npm run start
    ```

## NPM Scripts

1. `start`
    - starts all other processes for a single entrypoint for development
    - runs:
        1. `watch`
            - build application and start watch mode; builds to `./build`
        1. `serve`
            - runs a local web server to host `./build`
        1. `tunnel`
            - opens a tunnel to your local web server
1. `build`
    - builds a production version of the application; output directory: `./build`
1. `test`
    - runs jest tests
1. `eject`
    - (CAUTION) ejects from the `create-react-app` framework and toolset
    - This is only intended for advanced users; use at your own risk.
    - more information:
      - Official docs on the topic: https://create-react-app.dev/docs/available-scripts/#npm-run-eject
      - Alternatives to ejecting: https://medium.com/curated-by-versett/dont-eject-your-create-react-app-b123c5247741
1. `postinstall`
    - handles patching `react-scripts` with some small changes to the Webpack configuration to improve the developer experience

## Learn more about using the Maana Q Assistant Client library

- https://github.com/maana-io/q-assistant-client/tree/develop
- https://www.npmjs.com/package/@io-maana/q-assistant-client
