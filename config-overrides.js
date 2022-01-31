module.exports = function override (config, env) {
    let loaders = config.resolve;
    loaders.fallback = {
        stream: false,
        crypto: false,
    };
    if (env !== 'development') {
        config.optimization = {
            splitChunks: {
                chunks: 'all',
            },
        };
    }
    config.ignoreWarnings = [/Failed to parse source map/];
    
    return config
}