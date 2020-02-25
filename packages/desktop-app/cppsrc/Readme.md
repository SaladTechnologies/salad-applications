# GPU metric native Node library

The purpose of this library is to fetch GPU information that are not accessible through pure JS.

It is not intended to build/run this library on any other platform that Windows. 
The library is build and integrated to Node.js with [node-gyp](https://github.com/nodejs/node-gyp).

## Development
Windows users need to have the msvc14 (Visual Studio 2015) build tools set up on their system.
Luckily there is a npm package available for this purpose: npm i -g windows-build-tools.

```shell
npm i -g node-gyp
npm i -g windows-build-tools
```

## Usage
The C++ code can be compiled into the `./build/Release/gpu-metric.node` file.
This file can be imported through:

```js
const gpuInfoAddon = require('<path to>/build/Release/gpu-info.node');
```

## API

### API interface
Currently, there is no real interface defined. Once the library is called an
object with all information gets returned. The call overhead is small, thus the
library's intended use is to pull it frequently:
    
#### Implemented data points

It is planned to get following data points from all GPUs:

Data                            | Implemented | Win7 | Win10
---                             | ---         | ---  | ---
GPU Model                       |❌            |❌    |❌
GPU Dedicated Memory (per proc) |❌            |❌    |❌
GPU Shared Memory (per proc)    |❌            |❌    |❌
GPU Clock                       |❌            |❌    |❌
GPU Power                       |❌            |❌    |❌
GPU Mem Clock                   |❌            |❌    |❌
GPU Temp                        |❌            |❌    |❌
GPU Fan Speed                   |❌            |❌    |❌
GPU Usage                       |❌            |❌    |❌

