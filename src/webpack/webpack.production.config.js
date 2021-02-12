import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import { mergeWithRules } from 'webpack-merge';

import baseConfig from './webpack.common.config.js';

const prodConfig = mergeWithRules({
    module: {
        rules: {
            test: 'match',
            use: 'replace',
        },
    },
})(baseConfig, {
    mode: 'production',
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new CssMinimizerWebpackPlugin(),
    ],
    output: {
        filename: '[name].[contenthash].js',
    },
    module: {
        rules: [
            {
                test: /\.(less|css)$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
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
        minimizer: [new TerserWebpackPlugin(), new CssMinimizerWebpackPlugin()],
        runtimeChunk: {
            name: 'runtime',
        },
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                styles: {
                    name: 'styles',
                    type: 'css/mini-extract',
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },
    performance: {
        maxEntrypointSize: 800000,
        maxAssetSize: 800000,
    },
});

export default prodConfig;
