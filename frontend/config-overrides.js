const webpack = require('webpack');

// ref: https://gist.github.com/ef4/d2cf5672a93cf241fd47c020b9b3066a
module.exports = function override(config, env) {
  config.plugins.push(new webpack.ProvidePlugin({
    Buffer: ['buffer', 'Buffer'],
  }));

  config.resolve.fallback = {
    buffer: require.resolve("buffer/"),
    crypto: require.resolve("crypto-browserify"),
    fs: false,
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    stream: require.resolve("stream-browserify"),
    url: require.resolve("url/"),
    util: require.resolve("util/"),
    path: require.resolve("path-browserify")
    
  };

  return config;
};