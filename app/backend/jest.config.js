// jest.config.js
module.exports = {
    transform: {
        '^.+\\.jsx?$': 'babel-jest'
    },
    transformIgnorePatterns: [
        '/node_modules/'
    ],
    testEnvironment: 'node',
};
