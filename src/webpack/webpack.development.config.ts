import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack from 'webpack';
import { CustomizeRule, mergeWithRules } from 'webpack-merge';
import { WebpackPluginServe } from 'webpack-plugin-serve';

import baseConfig from './webpack.common.config';

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
    plugins: [new ReactRefreshWebpackPlugin(), new WebpackPluginServe({ port: 55554 })],
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
    watchOptions: {
        ignored: ['/node_modules/**', 'src/backend/**'],
    },
});

export default devConfig;
