export function toHexString(byteArray: Buffer | ReadonlyArray<number>) {
    return Array.from(byteArray, (byte: any) => {
        return ('0' + (byte & 0xff).toString(16)).slice(-2);
    }).join('');
}
export function fromHexString(hexString: string) {
    if (hexString.substr(0, 2) === '0x') hexString = hexString.substr(2);
    const bytes = [];
    for (let index = 0; index < hexString.length; index += 2)
        bytes.push(parseInt(hexString.substr(index, 2), 16));
    return bytes;
}
