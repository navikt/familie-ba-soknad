import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack from 'webpack';
import { CustomizeRule, mergeWithRules } from 'webpack-merge';
import { WebpackPluginServe } from 'webpack-plugin-serve';

import baseConfig, { createHtmlWebpackPlugin } from './webpack.common.config';

const devConfig: webpack.Configuration = mergeWithRules({
    module: {
        rules: {
            test: CustomizeRule.Match,
            options: CustomizeRule.Replace,
        },
    },
})(baseConfig, {
    mode: 'development',
    entry: {
        main: ['webpack-plugin-serve/client', './src/frontend/index.tsx'],
        disabled: ['webpack-plugin-serve/client', './src/frontend/disabled.tsx'],
    },
    devtool: 'inline-source-map',
    plugins: [
        createHtmlWebpackPlugin(false),
        new ReactRefreshWebpackPlugin(),
        new WebpackPluginServe(),
    ],
    optimization: {
        runtimeChunk: 'single',
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
    watch: true,
});

export default devConfig;
