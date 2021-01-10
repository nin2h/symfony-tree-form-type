module.exports = {
    moduleFileExtensions: ['js', 'ts'],
    testMatch: [
        "**/tests/**/*.ts", "**/?(*.)+(spec|test).[jt]s?(x)"
    ],
    roots: [
        '<rootDir>/src',
        '<rootDir>/tests',
    ],
    setupFilesAfterEnv: [
        "./tests/setup.js"
    ],
    moduleNameMapper: {
        '^@/(.*)': '<rootDir>/src/js/$1'
    }
};