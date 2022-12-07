const fs = require('fs');
const path = require('path');

function toPosixPath(input) {
    return input.replace(/\\/g, '/').replace(/^\w+:/, '');
}

const packageDir = toPosixPath(path.dirname(__dirname));
const repoDir = __dirname;

const plugins = [
    'prettier-plugin-toml',
    'prettier-plugin-sort-json',
    'prettier-plugin-packagejson',
    'prettier-plugin-multiline-arrays',
    'prettier-plugin-jsdoc',
].map(pluginName => {
    const nestedNodeModulesPath = path.posix.join(packageDir, 'node_modules', pluginName);
    const flattenedNodeModulesPath = path.posix.join(repoDir, 'node_modules', pluginName);
    // account for installations where node_modules is flattened and installations where it's nested
    if (fs.existsSync(nestedNodeModulesPath)) {
        return nestedNodeModulesPath;
    } else {
        return flattenedNodeModulesPath;
    }
});

/**
 * @typedef {import('prettier-plugin-multiline-arrays').MultilineArrayOptions} MultilineOptions
 *
 * @typedef {import('prettier').Options} PrettierOptions
 * @type {PrettierOptions & MultilineOptions}
 */
const prettierConfig = {
    arrowParens: 'avoid',
    bracketSameLine: false,
    bracketSpacing: false,
    endOfLine: 'lf',
    htmlWhitespaceSensitivity: 'ignore',
    jsonRecursiveSort: true,
    plugins,
    pluginSearchDirs: false,
    printWidth: 100,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
    overrides: [
        {
            files: [
                // 4 space tabs are huge in yaml files
                '*.yaml',
                '*.yml',
            ],
            options: {
                tabWidth: 2,
            },
        },
    ],
};

module.exports = prettierConfig;
