module.exports = {
    presets: [
        "@babel/preset-env", // Transpile modern JS for older environments
        "@babel/preset-react", // React JSX support
    ],
    plugins: [
        "@babel/plugin-transform-runtime", // Handles generator functions, async/await
        ["@babel/plugin-transform-class-properties", { loose: true }],
        ["@babel/plugin-transform-private-methods", { loose: true }],
        ["@babel/plugin-transform-private-property-in-object", { loose: true }],
    ],
};
