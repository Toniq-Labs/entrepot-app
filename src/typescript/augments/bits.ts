export function to32bitArray(input: number) {
    let b = new ArrayBuffer(4);
    new DataView(b).setUint32(0, input);
    return Array.from(new Uint8Array(b));
}

export function from32bits(ba: ReadonlyArray<number>): number {
    let value: number;
    for (let index = 0; index < 4; index++) {
        value = (value! << 8) | ba[index]!;
    }
    return value!;
}
