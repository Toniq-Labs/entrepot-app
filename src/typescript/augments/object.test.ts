import {NestedKeys, getValueFromNestedKeys} from './object';

type exampleObjectType = {
    topLevel: string;
    oneLevelDeep: {
        singleNestedProp: number;
    };
    threeLevelsDeep: {
        nestedOne: {
            nestedTwo: {
                nestedThree: {
                    propOne: RegExp;
                    propTwo: Date;
                };
            };
        };
    };
};

// testing NestedKeys
{
    const derp: NestedKeys<exampleObjectType> = {} as any;

    const tests: ReadonlyArray<NestedKeys<exampleObjectType>> = [
        // @ts-expect-error
        [],
        ['topLevel'],
        ['oneLevelDeep'],
        [
            'oneLevelDeep',
            // @ts-expect-error
            'oneLevelDeep',
        ],
        [
            'oneLevelDeep',
            // @ts-expect-error
            'topLevel',
        ],
        [
            'oneLevelDeep',
            'singleNestedProp',
        ],
        // @ts-expect-error
        [
            'oneLevelDeep',
            'nestedOne',
        ],
        [
            'threeLevelsDeep',
        ],
        [
            'threeLevelsDeep',
            'nestedOne',
        ],
        [
            'threeLevelsDeep',
            // @ts-expect-error
            'nestedTwo',
        ],
        [
            'threeLevelsDeep',
            'nestedOne',
            'nestedTwo',
            'nestedThree',
            'propOne',
        ],
        [
            'threeLevelsDeep',
            'nestedOne',
            'nestedTwo',
            'nestedThree',
            'propTwo',
        ],
        [
            'threeLevelsDeep',
            'nestedOne',
            'nestedTwo',
            'nestedThree',
            // @ts-expect-error
            'derp',
        ],
        // @ts-expect-error
        [
            'threeLevelsDeep',
            'singleNestedProp',
            'nestedTwo',
            'nestedThree',
        ],
    ];
}

// testing getValueFromNestedKeys
{
    const example: exampleObjectType = {} as any;
    const stringValue: string | undefined = getValueFromNestedKeys(example, ['topLevel']);

    const invalidCall = getValueFromNestedKeys(example, [
        // @ts-expect-error
        '',
    ]);

    const dateValue: Date | undefined = getValueFromNestedKeys(example, [
        'threeLevelsDeep',
        'nestedOne',
        'nestedTwo',
        'nestedThree',
        'propTwo',
    ]);
}
