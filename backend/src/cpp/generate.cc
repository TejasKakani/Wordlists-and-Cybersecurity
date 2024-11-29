#include <napi.h>
#include <vector>
#include <string>
#include <fstream>
#include <iostream>

class WordlistWorker : public Napi::AsyncWorker {

public:

	WordlistWorker(Napi::Function& callback, std::vector<std::string> clues, int length, 
					std::vector<int> startsWithCluesIndexes, std::vector<int> containsCluesIndexes, std::vector<int> endsWithCluesIndexes )
		: Napi::AsyncWorker(callback), clues(clues), length(length), startsWithCluesIndexes(startsWithCluesIndexes), containsCluesIndexes(containsCluesIndexes), endsWithCluesIndexes(endsWithCluesIndexes) {}

	void Execute() override {

		std::ofstream passFile;
		passFile.open("wordlist.txt", std::ios::out | std::ios::trunc);
		passFile.imbue(std::locale("en_US.UTF-8"));
		if (!passFile.is_open()) {
			SetError("Error opening file");
			return;
		}

		generateWordlist(length, clues, startsWithCluesIndexes, containsCluesIndexes, endsWithCluesIndexes, passFile);

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
	std::vector<int> startsWithCluesIndexes;
	std::vector<int> containsCluesIndexes;
	std::vector<int> endsWithCluesIndexes;
	int linesWritten = 0;

	int min(int a, int b) {
		if (a < b) return a;
		return b;
	}

	void write(const std::vector<std::string>& c, std::vector<int>& counters, int depth,
		std::ofstream& passFile) {
		for (int i = 1; i <= depth; i++) {
			passFile << c[counters[depth - i]];
		}
		passFile << "\n";
		linesWritten++;

	}

	void loop(int depth, std::vector<int>& bounds, std::vector<int>& counters, const std::vector<std::string>& c, std::ofstream& passFile) {
		if (depth <= 0) return;
		std::vector<int> copyCounters = counters;
		while (counters[depth - 1] <= bounds[depth - 1]) {
			write(c, counters, depth, passFile);
			counters[0] += 1;
			for (int i = 0; i < depth - 1; i++) {
				if (counters[i] > bounds[i]) {
					counters[i] = copyCounters[i];
					counters[i + 1] += 1;
				}
			}
		}
	}

	void getBoundsAndCounters(int length, std::vector<int>& counters, std::vector<int>& bounds,
		const std::vector<int>& startsWithClue,
		const std::vector<int>& endsWithClue, int &tracker) {

		int startsWithClueLength = startsWithClue.size();
		if (startsWithClueLength > 0) {
			for (int i = 0; i < min(length, startsWithClueLength); i++) {
				int index = length - i - 1;
				counters[index] = startsWithClue[i];
				bounds[index] = counters[index];
			}
		}

		tracker = length - startsWithClueLength;
		if (tracker <= 0) return;

		int endsWithClueLength = endsWithClue.size();
		if (endsWithClueLength > 0) {
			for (int i = 0; i < min(length, endsWithClueLength); i++) {
				int index = endsWithClueLength - i - 1;
				counters[i] = endsWithClue[index];
				bounds[i] = counters[i];
			}
		}

		tracker = tracker - endsWithClueLength;
	}

	void generateWordlist(int length, const std::vector<std::string>& clues,
		const std::vector<int>& startsWithClue,
		const std::vector<int>& containsClue,
		const std::vector<int>& endsWithClue,
		std::ofstream& passFile) {
		int cluesLength = clues.size();
		if (cluesLength <= 0) return;
		int startsWithClueLength = startsWithClue.size();
		int containsClueLength = containsClue.size();
		int endsWithClueLength = endsWithClue.size();

		std::vector<int> bounds(length, cluesLength - 1);
		std::vector<int> counters(length);

		int tracker = length;

		getBoundsAndCounters(length, counters, bounds, startsWithClue, endsWithClue, tracker);

		if (tracker > 0 && containsClueLength > 0) {

		int containsClueTraverseLength = tracker - containsClueLength + 1;
		if (containsClueTraverseLength <= 0) {
			containsClueTraverseLength = 1;
		}

		for (int i = startsWithClueLength; i < containsClueTraverseLength + startsWithClueLength; i++) {

			std::vector<int> tempBounds = bounds;
			std::vector<int> tempCounters = counters;

			for (int j = 0; j < min(tracker, containsClueLength); j++) {
				int index = length - 1 - j - i;
				tempCounters[index] = containsClue[j];
				tempBounds[index] = tempCounters[index];
			}

			loop(length, tempBounds, tempCounters, clues, passFile);

			for (int j = 0; j < min(tracker, containsClueLength); j++) {
				int index = length - 1 - j - i;
				tempCounters[index] = 0;
				tempBounds[index] = cluesLength - 1;
			}

		}

		return;
		}

		loop(length, bounds, counters, clues, passFile);
	}
};

int getElementIndex(std::string clue, Napi::Array clueArray) {
	for (uint32_t i = 0; i < clueArray.Length(); i++) {
		if (clue == clueArray.Get(i).ToString().Utf8Value()) {
			return i;
		}
	}
	return -1;
}

void GetStringArray(const Napi::CallbackInfo& info) {
	
    Napi::Env env = info.Env();

	Napi::Array clue = info[0].As<Napi::Array>();
	Napi::Number len = info[1].As<Napi::Number>();
	Napi::Array startsWithClue = info[2].As<Napi::Array>();
	Napi::Array containsClue = info[3].As<Napi::Array>();
	Napi::Array endsWithClue = info[4].As<Napi::Array>();

	int length = len.Int32Value();

	std::vector<std::string> clues;

	std::vector<int> startsWithCluesIndexes;
	std::vector<int> containsCluesIndexes;
	std::vector<int> endsWithCluesIndexes;

	for (uint32_t i = 0; i < clue.Length(); i++) {
		clues.push_back(clue.Get(i).ToString().Utf8Value());
	}

	for (uint32_t i = 0; i < startsWithClue.Length(); i++) {
		startsWithCluesIndexes.push_back(getElementIndex(startsWithClue.Get(i).ToString().Utf8Value(), clue));
	}

	for (uint32_t i = 0; i < containsClue.Length(); i++) {
		containsCluesIndexes.push_back(getElementIndex(containsClue.Get(i).ToString().Utf8Value(), clue));
	}

	for (uint32_t i = 0; i < endsWithClue.Length(); i++) {
		endsWithCluesIndexes.push_back(getElementIndex(endsWithClue.Get(i).ToString().Utf8Value(), clue));
	}

	Napi::Function callback = info[5].As<Napi::Function>();

	WordlistWorker* worker = new WordlistWorker(callback, clues, length, startsWithCluesIndexes, containsCluesIndexes, endsWithCluesIndexes);
	worker->Queue();

}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "getStringArray"), Napi::Function::New(env, GetStringArray));
    return exports;
}

NODE_API_MODULE(generate, Init)
