const hnswlibModule = require('../build/hnswlib-wasm.js');
const emnapi = require('@emnapi/runtime');

let hnswlib;

describe('hnswlibModule', () => {

    beforeAll(async () => {
        const Module = await hnswlibModule();
        hnswlib = Module.emnapiInit({ context: emnapi.getDefaultContext() })
    });

    it('should be defined', () => {
        expect(hnswlib).toBeDefined();
    });
});