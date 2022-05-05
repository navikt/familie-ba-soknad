// Jest nekter å lese .babelrc-filer, så da får det bli babel.config.cjs
module.exports = {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
        [
            'babel-plugin-styled-components',
            {
                displayName: process.env.NODE_ENV !== 'production',
            },
            '@babel/plugin-syntax-import-assertions',
            [
                'transform-react-remove-prop-types',
                {
                    mode: 'remove',
                    removeImport: 'true',
                    ignoreFilenames: ['node_modules'],
                },
            ],
        ],
    ],
};
