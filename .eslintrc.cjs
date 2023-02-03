/** @type {import('eslint').Linter.Config} */
const eslintConfig = {
    extends: ['react-app'],
    globals: {
        globalThis: false,
        BigInt: true,
    },
    rules: {
        eqeqeq: [
            'off',
        ],
    },
};

module.exports = eslintConfig;
