import path from 'path';

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack from 'webpack';
import { CustomizeRule, mergeWithRules } from 'webpack-merge';

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
        main: ['./src/frontend/index.tsx'],
        disabled: ['./src/frontend/disabled.tsx'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(process.cwd(), 'dist/'),
        pathinfo: false,
    },
    devtool: 'eval-source-map',
    devServer: {
        hot: true,
        port: 55554,
        client: {
            progress: true,
            overlay: true,
        },
        open: true,
        historyApiFallback: true,
        proxy: {
            '/modellversjon': 'http://localhost:3000',
            '/api': 'http://localhost:3000',
            '/toggles': 'http://localhost:3000',
            '/konverter': 'http://localhost:3000',
        },
    },
    plugins: [new ReactRefreshWebpackPlugin()],
    optimization: {
        runtimeChunk: true,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
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
    watchOptions: {
        ignored: ['/node_modules/**', 'src/backend/**', 'dist/**', 'build/**'],
    },
});

export default devConfig;
