// hello_array.cc
#include <napi.h>
#include <vector>
#include <string>

Napi::Array GetStringArray(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    // Create a C++ vector of strings
    std::vector<std::string> myStrings = { "Hello", "from", "C++", "addon" };

    // Create a JavaScript array
    Napi::Array result = Napi::Array::New(env, myStrings.size());

    // Fill the JavaScript array with C++ strings
    for (size_t i = 0; i < myStrings.size(); i++) {
        result.Set(i, Napi::String::New(env, myStrings[i]));
    }

    return result;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "getStringArray"), Napi::Function::New(env, GetStringArray));
    return exports;
}

NODE_API_MODULE(addon, Init)
