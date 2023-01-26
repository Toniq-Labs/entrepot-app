import {itCases} from '@augment-vir/browser-testing';
import {html} from 'element-vir';
import {createQueryParamString} from './url';

describe(createQueryParamString.name, () => {
    itCases(createQueryParamString, [
        {
            it: 'should handle big object',
            inputs: [
                {
                    what: 'is this',
                    big: 'query',
                    lots: 'of inputs',
                    also: 4,
                    maybe: true,
                },
            ],
            expect: '?what=is+this&big=query&lots=of+inputs&also=4&maybe=true',
        },
        {
            it: 'should handle undefined',
            inputs: [
                {
                    what: 'is this',
                    big: undefined,
                },
            ],
            expect: '?what=is+this',
        },
        {
            it: 'should handle undefined params',
            inputs: [
                {
                    what: undefined,
                    big: undefined,
                },
            ],
            expect: '',
        },
        {
            it: 'should handle undefined params and undefined values without keys',
            inputs: [
                {
                    what: undefined,
                    big: undefined,
                },
                [undefined],
            ],
            expect: '',
        },
        {
            it: 'should handle values without keys',
            inputs: [
                {
                    what: 'is this',
                },
                [
                    0,
                    'hello',
                ],
            ],
            expect: '?what=is+this&0&hello',
        },
        {
            it: 'should handle values without keys without any params',
            inputs: [
                {},
                [
                    0,
                    'hello',
                ],
            ],
            expect: '?0&hello',
        },
        {
            it: 'should handle undefined values without keys',
            inputs: [
                {
                    what: 'is this',
                },
                [
                    undefined,
                    'hello',
                ],
            ],
            expect: '?what=is+this&hello',
        },
    ]);
});
