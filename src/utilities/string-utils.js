export function uppercaseFirstLetterOfWord(string) {
    return String(string)
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b(\w)/g, firstLetterOfWord => firstLetterOfWord.toUpperCase());
}
