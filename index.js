/**
 * @nexray/api - Main Entry Point
 * Official NexRay API Client
 * 
 * Contoh penggunaan:
 * const nexray = require('@nexray/api');
 * const response = await nexray.get('/ai/lumin', { text: 'Halo' });
 */

const NexRayAPIClient = require('./src/index');

// Create default instance with config.json
const defaultClient = new NexRayAPIClient();

// Export methods from default instance
const api = {
  // HTTP Methods
  get: defaultClient.get.bind(defaultClient),
  getBuffer: defaultClient.getBuffer.bind(defaultClient),
  post: defaultClient.post.bind(defaultClient),
  postForm: defaultClient.postForm.bind(defaultClient),
  put: defaultClient.put.bind(defaultClient),
  delete: defaultClient.delete.bind(defaultClient),
  patch: defaultClient.patch.bind(defaultClient),
  
  // Configuration
  setAuthToken: defaultClient.setAuthToken.bind(defaultClient),
  setHeader: defaultClient.setHeader.bind(defaultClient),
  removeHeader: defaultClient.removeHeader.bind(defaultClient),
  setBaseURL: defaultClient.setBaseURL.bind(defaultClient),
  setTimeout: defaultClient.setTimeout.bind(defaultClient),
  
  // Info
  getConfig: defaultClient.getConfig.bind(defaultClient),
  getErrorMessage: defaultClient.getErrorMessage.bind(defaultClient),
  
  // Classes
  Client: NexRayAPIClient,
  Engine: require('./engine-requirements')
};

// Export as default
module.exports = api;
module.exports.default = api;
