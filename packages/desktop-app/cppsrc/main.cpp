/* cppsrc/main.cpp */
#include <napi.h>
#include <iostream>
extern "C" {
#include "gpu.h"
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  init_gpu_info();
  deinit_gpu_info();
  return exports;
}

NODE_API_MODULE(testaddon, InitAll)
