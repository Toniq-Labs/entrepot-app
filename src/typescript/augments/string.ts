export function toHexString(byteArray: Buffer | ReadonlyArray<number>) {
    return Array.from(byteArray, (byte: any) => {
        return ('0' + (byte & 0xff).toString(16)).slice(-2);
    }).join('');
}
export function fromHexString(hexString: string) {
    console.log({hexString});
    if (hexString.substring(0, 2) === '0x') hexString = hexString.substring(2);
    const bytes = [];
    for (let index = 0; index < hexString.length; index += 2)
        bytes.push(parseInt(hexString.substring(index, 2), 16));
    return bytes;
}
