import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { mergeWithRules } from 'webpack-merge';

import baseConfig from './webpack.production.config.js';

const analysisConfig = mergeWithRules({})(baseConfig, {
    plugins: [new BundleAnalyzerPlugin()],
});

export default analysisConfig;
