module.exports = {
  publicPath: '/gix/',
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    config.module
      .rule('svg')
      .test(/\.svg$/i)
      .use('url-loader')
      .loader('url-loader')
      .tap((options) =>
        // modify the options...
        ({ ...options, limit: 100000 }),
      );
  },
};
