// metro.config.js
const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');

/**
 * Metro configuration for Expo (React Native)
 * - Polyfills Node.js core modules for @supabase/realtime-js
 * - Shims all 'ws' imports (including server-side subpaths) to use global WebSocket
 */
const config = getDefaultConfig(__dirname);

// 1) Respect the 'browser' entry to avoid server-only code
config.resolver.mainFields = ['react-native', 'browser', 'main'];

// 2) Polyfill essential Node.js core modules
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  buffer: require.resolve('buffer/'),
  crypto: require.resolve('crypto-browserify'),
  events: require.resolve('events'),
  path: require.resolve('path-browserify'),
  process: require.resolve('process/browser'),
  stream: require.resolve('stream-browserify'),
  url: require.resolve('url/'),
  util: require.resolve('util/'),
};

// 3) Shim all 'ws' module imports to a simple WebSocket stub
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === 'ws' ||
    moduleName.startsWith('ws/') ||
    moduleName.endsWith('websocket-server.js')
  ) {
    return {
      filePath: path.resolve(__dirname, 'shim/ws.js'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

// 4) Watch the shim folder
config.watchFolders = [path.resolve(__dirname, 'shim')];

module.exports = config;
