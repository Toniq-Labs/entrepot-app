import {itCases} from '@augment-vir/browser-testing';
import {html} from 'element-vir';
import {convertTemplateToString} from './lit';

describe(convertTemplateToString.name, () => {
    itCases(convertTemplateToString, [
        {
            it: 'should handle attributes that are not surrounded in quotes',
            input: html`
                <img src=${'what have we here!?'} />
            `,
            expect: '<img src="what have we here!?" />',
        },
    ]);
});
