import {randomString} from '@augment-vir/browser';
import {assert} from '@open-wc/testing';
import {assertTypeOf} from '@augment-vir/browser-testing';
import {defineAutomaticallyUpdatingCache, SubKeyRequirementEnum} from './define-local-cache';

describe(defineAutomaticallyUpdatingCache.name, () => {
    type TestCacheValue = {
        inputA: string;
        inputB: string;
        randomNumber: number;
    };

    type TestCacheInputs = {inputA: string; inputB: string};

    const testCache = defineAutomaticallyUpdatingCache({
        cacheName: 'test-cache',
        keyGenerator: ({inputA, inputB}: TestCacheInputs) => {
            return `${inputA}-${inputB}`;
        },
        subKeyRequirement: SubKeyRequirementEnum.Required,
        valueUpdater: ({inputA, inputB}: TestCacheInputs): TestCacheValue => {
            return {
                inputA,
                inputB,
                randomNumber: Math.random(),
            };
        },
        enableAutomaticUpdating: false,
        enableCacheBrowserStorage: true,
        enableCacheMemory: true,
        enableLogging: false,
        minUpdateInterval: Infinity,
    });

    it('should have correct types', () => {
        assertTypeOf<Parameters<typeof testCache.get>>().toEqualTypeOf<
            [
                {
                    inputA: string;
                    inputB: string;
                },
            ]
        >();
        assertTypeOf<Awaited<ReturnType<typeof testCache.get>>>().toEqualTypeOf<TestCacheValue>();
    });

    it('should actually cache values', async () => {
        const subscriptionValues: {
            generatedKey: string;
            newValue: TestCacheValue;
        }[] = [];
        const inputs: TestCacheInputs = {
            inputA: randomString(),
            inputB: randomString(),
        };
        testCache.subscribe(value => {
            subscriptionValues.push(value);
        });
        const firstValue = await testCache.get(inputs);
        // this should be cached so we should get the same value without any recalculation
        const secondValue = await testCache.get(inputs);
        const afterUpdateValue = await testCache.forceImmediateUpdate(inputs);

        assert.deepStrictEqual(
            {
                inputA: firstValue.inputA,
                inputB: firstValue.inputB,
            },
            inputs,
        );
        assert.deepStrictEqual(firstValue, secondValue);
        assert.deepStrictEqual(
            {
                inputA: afterUpdateValue.inputA,
                inputB: afterUpdateValue.inputB,
            },
            {
                inputA: firstValue.inputA,
                inputB: firstValue.inputB,
            },
        );
        assert.notStrictEqual(afterUpdateValue.randomNumber, firstValue.randomNumber);
        assert.deepStrictEqual(subscriptionValues, []);
    });
});
