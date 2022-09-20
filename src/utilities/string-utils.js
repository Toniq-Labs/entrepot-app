export function uppercaseFirstLetterOfWord(string) {
  return string.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, firstLetterOfWord => firstLetterOfWord.toUpperCase());
}
