/** @type {import('eslint').Linter.Config} */
const eslintConfig = {
    extends: ['react-app'],
    globals: {
        globalThis: false,
    },
    rules: {
        eqeqeq: [
            'off',
        ],
    },
};

module.exports = eslintConfig;
