{
	"targets": [
		{
			"target_name": "addon",
			"sources": [ "backend/src/cpp/hello.cc" ],
			"include_dirs": [
			     "./node_modules/node-addon-api/"
			],
			"defines": [
				"NAPI_CPP_EXCEPTIONS"
			],
		}
	]
}