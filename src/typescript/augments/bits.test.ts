import {itCases} from '@augment-vir/browser-testing';
import {to32bitArray} from './bits';

describe(to32bitArray.name, () => {
    itCases(to32bitArray, [
        {
            it: 'should handle a basic case',
            input: 5,
            expect: [
                0,
                0,
                0,
                5,
            ],
        },
        {
            it: 'should handle a large case',
            input: 5000000000000000000,
            expect: [
                68,
                244,
                0,
                0,
            ],
        },
    ]);
});
