#include <napi.h>
#include <vector>
#include <string>
#include <stdio.h>
#include <fstream>

class WordlistWorker : public Napi::AsyncWorker {

public:

	WordlistWorker(Napi::Function& callback, std::vector<std::string> clues, int length)
		: Napi::AsyncWorker(callback), clues(clues), length(length) {}

	void Execute() override {
		
		std::ofstream passFile;
		passFile.open("wordlist.txt", std::ios::out | std::ios::trunc);
		passFile.imbue(std::locale("en_US.UTF-8"));
		if (!passFile.is_open()) {
			SetError("Error opening file");
			return;
		}

		generateWordlist(length, clues, passFile);

		if (passFile.fail()) {
			SetError("Error writing to file");
			return;
		}

		passFile.flush();
		passFile.close();

	}

	void OnOK() override {
		Napi::HandleScope scope(Env());
		Callback().Call({ Napi::Number::New(Env(), linesWritten) });
	}

	void OnError(const Napi::Error& e) override {
		Napi::HandleScope scope(Env());
		Callback().Call({ e.Value() });
	}

private:

	std::vector<std::string> clues;
	int length;
	int linesWritten = 0;

	void write(const std::vector<std::string>& c, const std::vector<int>& counters, int depth,
		std::ofstream& passFile) {
		for (int i = 1; i <= depth; i++) {
			passFile << c[counters[depth - i]];
		}
		passFile << "\n";
		linesWritten++;
		
	}

	void loop(int depth, const std::vector<int>& bounds, const std::vector<std::string>& c, std::ofstream& passFile) {
		std::vector<int> counters(depth);
		while (counters[depth - 1] <= bounds[depth - 1]) {
			write(c, counters, depth, passFile);
			counters[0] += 1;
			for (int i = 0; i < depth - 1; i++) {
				if (counters[i] > bounds[i]) {
					counters[i] = 0;
					counters[i + 1] += 1;
				}
			}
		}
	}

	void generateWordlist(int length, const std::vector<std::string>& clues, std::ofstream& passFile) {
		int cluesLength = clues.size();
		std::vector<int> bounds(length, cluesLength - 1);
		loop(length, bounds, clues, passFile);
		
	}
};

void GetStringArray(const Napi::CallbackInfo& info) {
	
    Napi::Env env = info.Env();

	Napi::Array myArray = info[0].As<Napi::Array>();
	Napi::Number len = info[1].As<Napi::Number>();

	int length = len.Int32Value();

	std::vector<std::string> clues;

	for (uint32_t i = 0; i < myArray.Length(); i++) {
		clues.push_back(myArray.Get(i).ToString().Utf8Value());
	}

	Napi::Function callback = info[2].As<Napi::Function>();

	WordlistWorker* worker = new WordlistWorker(callback, clues, length);
	worker->Queue();

}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "getStringArray"), Napi::Function::New(env, GetStringArray));
    return exports;
}

NODE_API_MODULE(generate, Init)
