// shim/ws.js
/**
 * Metro shim for 'ws' in React Native:
 * Export the global WebSocket so that @supabase/realtime-js
 * uses the built-in WebSocket rather than the server code.
 */
module.exports = global.WebSocket;
