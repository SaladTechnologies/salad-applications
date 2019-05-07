# Salad Desktop Application

The Salad Desktop Application is the primary application that users install on their machines allowing them to convert PC idle-time into rewards. The desktop application is an Electron Application that is bundled with all the native frameworks needed for mining and running High Performance Computing jobs.

Note: The Salad Desktop Application currently only supports Windows 7 and 10. Linux and Mac will be supported in the future.

## Getting Started

To run the Desktop Application in development mode run

```
yarn start
```

## Architecture

### Browser Windows

Salad uses multiple Electron `BrowserWindows` to maintaine seperation between foreground and background processes.

#### Main Window

The main window that displays the web application from [app.salad.io](https://app.salad.io/). This window will only appear if the machine is online and once the web application has been fully loaded. All content (html, js, css...) is loaded remotely.

#### Online Status Window

A hidden window that checks the online status of the machine every X sec by pinging different webservices and websites. If the machine is offline, it will open up the `Offline Window`. All content (html, js, css...) is loaded locally.

#### Offline Window

Modal that lets the user know that they are currenly offline. If the machine goes online, this window will automatically close and show the `Main Window`. All content (html, js, css...) is loaded locally.

### Native Integration

The Desktop Application serves the UI from [app.salad.io](https://app.salad.io/) and provides hooks that allow the web application to interface with the native OS. This bridge from web app to native is accomplished by injecting a bridge objects into the web application at `window.salad`, allowing the web application to call native methods and interface with the computing frameworks.

## Ethminer

The Salad Desktop Application includes a wrapper around ethminer, allowing Salad to interface with an Ethereum mining solution that supports both OpenCL- and CUDA-compatible devices. Salad currently only supports Windows environments and will not work in a browser. Ethminer also supports OSX and Linux, so additional platform support is planned for future releases.

In order to run Salad with Ethminer you will need to copy ethminer into the folder at `packages\desktop-app\dist\ethminer` before running the application. Ethminer is available on [GitHub](https://github.com/ethereum-mining/ethminer).
