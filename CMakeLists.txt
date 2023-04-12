cmake_minimum_required(VERSION 3.13)

project(hnswlib-wasm)

add_subdirectory("${CMAKE_CURRENT_SOURCE_DIR}/node_modules/emnapi")

add_executable(hnswlib-wasm ./src/addon.cc)

target_include_directories(hnswlib-wasm PRIVATE ${CMAKE_JS_INC})

if(WIN32)
  target_compile_definitions(hnswlib-wasm PRIVATE _HAS_EXCEPTIONS=1)
endif()

if(APPLE)
  target_compile_options(hnswlib-wasm PRIVATE -fvisibility=hidden)
endif()

if(CMAKE_SYSTEM_NAME STREQUAL "Emscripten")
  target_link_libraries(hnswlib-wasm emnapi-mt)
  target_compile_options(hnswlib-wasm PRIVATE "-pthread")
  target_link_options(hnswlib-wasm PRIVATE
    "-sALLOW_MEMORY_GROWTH=1"
    "-sEXPORTED_FUNCTIONS=['_napi_register_wasm_v1','_malloc','_free']"
    "-pthread"
    "-sPTHREAD_POOL_SIZE=4"
    "-sSTACK_SIZE=2MB"
    "-sDEFAULT_PTHREAD_STACK_SIZE=2MB"
    "-sMODULARIZE=1"
    # Export name is required when using MODULARIZE with emnapi
    "-sEXPORT_NAME=hnswlibModule"
    "-sNO_DISABLE_EXCEPTION_CATCHING"
  )
elseif(CMAKE_C_COMPILER_TARGET STREQUAL "wasm32-wasi-threads")
  target_link_libraries(hnswlib-wasm emnapi-mt)
  set_target_properties(hnswlib-wasm PROPERTIES SUFFIX ".wasm")
  target_compile_options(hnswlib-wasm PRIVATE "-fno-exceptions" "-pthread")
  target_link_options(hnswlib-wasm PRIVATE
    "-pthread"
    "-mexec-model=reactor"
    "-Wl,--import-memory"
    "-Wl,--max-memory=2147483648"
    "-Wl,--export-dynamic"
    "-Wl,--export=malloc"
    "-Wl,--export=free"
    "-Wl,--import-undefined"
    "-Wl,--export-table"
  )
elseif((CMAKE_C_COMPILER_TARGET STREQUAL "wasm32") OR (CMAKE_C_COMPILER_TARGET STREQUAL "wasm32-unknown-unknown"))
  target_link_libraries(hnswlib-wasm emnapi-basic-mt)
  set_target_properties(hnswlib-wasm PROPERTIES SUFFIX ".wasm")
  target_compile_options(hnswlib-wasm PRIVATE "-fno-exceptions" "-matomics" "-mbulk-memory")
  target_link_options(hnswlib-wasm PRIVATE
    "-nostdlib"
    "-Wl,--no-entry"
    "-Wl,--export=napi_register_wasm_v1"
    "-Wl,--export=emnapi_async_worker_create"
    "-Wl,--export=emnapi_async_worker_init"
    "-Wl,--import-memory,--shared-memory,--max-memory=2147483648,--import-undefined"
    "-Wl,--export-dynamic,--export=malloc,--export=free,--export-table"
  )
else()
  target_link_libraries(hnswlib-wasm emnapi)
endif()
