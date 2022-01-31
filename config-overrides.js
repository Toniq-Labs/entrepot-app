module.exports = function override(config, env) {
    let loaders = config.resolve;
    loaders.fallback = {
        stream: false,
    };
    config.optimization = {
        splitChunks: {
            chunks: 'all',
        },
    };

    return config;
};
