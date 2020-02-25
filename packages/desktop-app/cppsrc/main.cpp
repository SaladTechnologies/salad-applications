/* cppsrc/main.cpp */
#include <napi.h>

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  return exports;
}

std::string hello(){
  return "Hello World";
}

NODE_API_MODULE(testaddon, InitAll)
