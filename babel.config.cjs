// Jest nekter å lese .babelrc-filer, så da får det bli babel.config.cjs
module.exports = {
    presets: [
        'react-app',
        "@babel/preset-env",
        "@babel/preset-react"],
    plugins: [
        [
            'babel-plugin-styled-components',
            {
                displayName: process.env.NODE_ENV !== 'production',
            },
            "@babel/plugin-syntax-import-assertions",
        ],
    ],
};
