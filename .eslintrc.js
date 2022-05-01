/* eslint no-undef: 0 */

module.exports = {
    env: {
        browser: true,
        node: true,
        es2021: true,
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        'no-console': 1,
        'no-unused-vars': 0,
        quotes: [2, 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    },
};
