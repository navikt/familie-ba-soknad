import path from 'path';

import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';

export default {
    mode: 'production',
    entry: ['./src/frontend/index.tsx'],
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(process.cwd(), 'src/frontend/public/index.html'),
            inject: 'body',
            alwaysWriteToDisk: true,
        }),
        new CopyWebpackPlugin({
            patterns: [
                'src/frontend/public/manifest.json',
                'src/frontend/public/favicon.ico',
                'src/frontend/public/robots.txt',
            ],
        }),
        new CaseSensitivePathsPlugin(),
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.less'],
    },
    output: {
        filename: 'main.js',
        path: path.resolve(process.cwd(), 'dist'),
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
                exclude: /node_modules/,
                use: ['file-loader?name=public/[name].[ext]'],
            },
            {
                test: /\.(jsx|tsx|ts|js)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['react-app'],
                },
            },
            {
                test: /\.(less|css)$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                compileType: 'icss',
                            },
                        },
                    },
                    { loader: 'less-loader' },
                ],
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserWebpackPlugin()],
    },
};
