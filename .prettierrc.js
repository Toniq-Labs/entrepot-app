const plugins = [
    'prettier-plugin-sort-json',
    'prettier-plugin-packagejson',
    'prettier-plugin-organize-imports',
    'prettier-plugin-jsdoc',
].map((pluginName) => {
    const defaultPath = `./node_modules/${pluginName}`;
    return defaultPath;
});
/** @type {import('prettier').Options} */
const config = {
    arrowParens: 'always',
    bracketSpacing: false,
    endOfLine: 'lf',
    htmlWhitespaceSensitivity: 'ignore',
    jsonRecursiveSort: true,
    bracketSameLine: false,
    plugins,
    printWidth: 100,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
};

module.exports = config;
