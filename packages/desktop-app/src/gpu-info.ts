const binary = require('../build/Release/gpu-info.node');

export interface GPUInformer {
    version(): string;
}

export const GPUInfoBinary: GPUInformer = binary as GPUInformer;



