// babel.config.js
module.exports = function (api) {
    api.cache(true);
    return {
      presets: [
        [
          'babel-preset-expo',
          {
            // polyfill import.meta for Hermes
            unstable_transformImportMeta: true,
          },
        ],
      ],
    };
  };
  