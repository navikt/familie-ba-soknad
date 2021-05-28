import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack from 'webpack';
import { mergeWithRules } from 'webpack-merge';

import baseConfig from './webpack.common.config.js';

const devConfig = mergeWithRules({
    module: {
        rules: {
            test: 'match',
            options: 'replace',
        },
    },
})(baseConfig, {
    mode: 'development',
    entry: ['webpack-hot-middleware/client'],
    devtool: 'inline-source-map',
    plugins: [new webpack.HotModuleReplacementPlugin(), new ReactRefreshWebpackPlugin()],
    output: {
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.(jsx|tsx|ts|js)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['react-app'],
                    plugins: ['react-refresh/babel'],
                },
            },
        ],
    },
});

export default devConfig;
