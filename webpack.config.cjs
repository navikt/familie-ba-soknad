const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    entry: {
        'familie-ba-soknad': ['./src/index.tsx'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/public/index.html'),
            inject: 'body',
            alwaysWriteToDisk: true
        }),
        new CopyWebpackPlugin({
            patterns: [
                "src/public/manifest.json",
                "src/public/favicon.ico",
                "src/public/robots.txt"
            ]
        })
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.less'],
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
                exclude: /node_modules/,
                use: ['file-loader?name=public/[name].[ext]']
            },
            {
                test: /\.(jsx|tsx|ts)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ["react-app"]
                },
            },
            {
                test: /\.(js|ts|tsx)$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    transpileOnly: true,
                },
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {
                            limit: 10000,
                        },
                    },
                ],
            },
            {
                test: /\.(less|css)$/,
                use: [
                    { loader: require.resolve('style-loader') },
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            modules: {
                                compileType: 'icss',
                            },
                        },
                    },
                    { loader: require.resolve('less-loader') },
                ],
            },
        ],
    },
};
