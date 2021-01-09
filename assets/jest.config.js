module.exports = {
    moduleFileExtensions: ['js', 'ts'],
    testMatch: [
        "**/tests/**/*.ts", "**/?(*.)+(spec|test).[jt]s?(x)"
    ],
    roots: [
        '<rootDir>/src',
        '<rootDir>/tests',
    ],
    setupFiles: [
        "./tests/setup.js"
    ]
};