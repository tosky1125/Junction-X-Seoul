module.exports = function (api) {
    api.cache(true);
    const presets = [
        '@babel/preset-env',
        '@babel/preset-typescript',
        // '@babel/typescript',
    ];
    const plugins = [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-class-properties',
    ];
    return {
        presets,
        plugins,
    };
};
