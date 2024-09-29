{
	"targets": [
		{
			"target_name": "generate",
			"sources": [ "./src/cpp/generate.cc" ],
			"include_dirs": [
			     "./node_modules/node-addon-api/"
			],
			"defines": [
				"NAPI_CPP_EXCEPTIONS"
			],
			"cpp" : [
				"-std=c++17"
			]
		}
	]
}