export function uppercaseFirstLetterOfWord(string) {
    return String(string)
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b(\w)/g, firstLetterOfWord => firstLetterOfWord.toUpperCase());
}

export function camelCaseToTitleCase(string) {
    const toSpacedWords = String(string).replace(/([A-Z])/g, ' $1');
    return uppercaseFirstLetterOfWord(toSpacedWords);
}
