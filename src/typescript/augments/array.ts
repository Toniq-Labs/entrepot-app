export function shuffle<T>(input: ReadonlyArray<T>): ReadonlyArray<T> {
    return input
        .map(value => {
            return {value, sort: Math.random()};
        })
        .sort((a, b) => a.sort - b.sort)
        .map(({value}) => value);
}
