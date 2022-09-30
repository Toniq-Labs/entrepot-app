export function spreadableSearchParams(searchParams) {
    return Array.from(searchParams.keys()).reduce((accum, key) => {
        return {
            ...accum,
            [key]: searchParams.get(key),
        };
    }, {});
}
