{
    "targets": [{
        "target_name": "gpu-info",
        "cflags!": [ "-fno-exceptions" ],
        "cflags_cc!": [ "-fno-exceptions" ],
        "sources": [
            	"cppsrc/main.cpp",
		"cppsrc/gpu.h",
		"cppsrc/gpu.c"
        ],
        'include_dirs': [
	    "C:/Program Files (x86)/Windows Kits/10/Include/10.0.17763.0/km/",
            "<!@(node -p \"require('node-addon-api').include\")"
        ],

        'libraries': ["Cfgmgr32.lib", "pdh.lib"],
        'dependencies': [
            "<!(node -p \"require('node-addon-api').gyp\")"
        ],
        'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ]
    }]
}
