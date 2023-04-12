# hnswlib-wasm

`hnswlib-wasm` is a WebAssembly (WASM) binding for the HNSWLIB library, built on top of (hnswlib-node)[https://github.com/yoshoku/hnswlib-node] using (Emnapi)[https://github.com/toyobayashi/emnapi].


## Installation

Install `hnswlib-wasm` using npm:

```bash
npm install hnswlib-wasm
```

## Usage

Here's an example of how to use the `hnswlib-wasm` library:

```javascript
import {getDefaultContext} from '@emnapi/runtime';
import hnswlibModule from 'hnswlib-wasm';

(async () => {
  const Module = await hnswlibModule();
  const hnswlib = Module.emnapiInit({ context: emnapi.getDefaultContext() });
  const { HierarchicalNSW } = hnswlib;

  const numDimensions = 5;
  const maxElements = 1000;

  const index = new HierarchicalNSW('l2', numDimensions);
  index.initIndex(maxElements, 16, 200, 100);

  index.addPoint([0, 1, 2, 3, 4], 0);
  index.addPoint([1, 2, 3, 4, 5], 1);
  index.addPoint([3, 4, 5, 6, 6], 2);

  const numNeighbors = 3;
  const result = index.searchKnn([1, 4, 2, 3, 4], numNeighbors);
  console.log(result);
})();
```
## API
Since this library is built on top of (hnswlib-node)[https://github.com/yoshoku/hnswlib-node], the api is exactly the same as those listed (here)[https://yoshoku.github.io/hnswlib-node/doc/]. The only difference in usage is the presence of the web assembly module. Using the web assembly module is illustrated in the example given above.

## Building the library

To build the library, you can use the following npm script:

```
npm run build
```

This will execute the necessary CMake commands to build the WASM module.
Tests

To run the tests, simply execute:

```bash
npm test
```

## License

hnswlib-wasm is licensed under the Apache-2.0 License.

## Acknowledgements
These bindings were created on top of the (hnswlib-node)[https://github.com/yoshoku/hnswlib-node] package.
The (emnapi)[https://github.com/toyobayashi/emnapi] library was invaluable in the creation of these bindings.