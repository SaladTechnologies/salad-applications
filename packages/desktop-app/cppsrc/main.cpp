/* cppsrc/main.cpp */
#include <napi.h>
#include <iostream>
extern "C" {
#include "gpu.h"
}

Napi::String Version(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "v0.0.1");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  init_gpu_info();
  deinit_gpu_info();

  exports.Set(Napi::String::New(env, "version"),
              Napi::Function::New(env, Version));
  return exports;
}

NODE_API_MODULE(gpu_info, Init)

