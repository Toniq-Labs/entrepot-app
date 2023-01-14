export function to32bitArray(input: number) {
    let b = new ArrayBuffer(4);
    new DataView(b).setUint32(0, input);
    return Array.from(new Uint8Array(b));
}
