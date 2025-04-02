module.exports = {
    testEnvironment: "jsdom",
    setupFiles: ["<rootDir>/jest.setup.js"],
    testMatch: [
        "<rootDir>/src/__tests__/**/*.[jt]s?(x)", // Match JS/JSX and TS/TSX files
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}",
        "!src/index.js",
        "!src/reportWebVitals.js",
    ],
    coverageDirectory: "<rootDir>/coverage",
    coverageReporters: ["text", "lcov"],
    moduleNameMapper: {
        "\\.(css|scss)$": "identity-obj-proxy", // Mock CSS and SCSS files
    },
    transformIgnorePatterns: [
        "/node_modules/(?!(firebase|@firebase|node-fetch|data-uri-to-buffer|fetch-blob)/)", // Add necessary packages to be transformed by Babel
    ],
    transform: {
        "^.+\\.[jt]sx?$": "babel-jest", // Use Babel to transform JavaScript/TypeScript files
    },
};
