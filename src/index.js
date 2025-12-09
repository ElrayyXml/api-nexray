/**
 * Core NexRay API Client
 */

const NexRayEngine = require('../engine-requirements');
const config = require('../config.json');

class NexRayAPIClient {
  constructor(customConfig = {}) {
    this.engine = new NexRayEngine(customConfig);
  }

  // HTTP Methods
  async get(endpoint, params = {}, options = {}) {
    return this.engine.get(endpoint, params, options);
  }

  async getBuffer(endpoint, params = {}, options = {}) {
    return this.engine.getBuffer(endpoint, params, options);
  }

  async post(endpoint, data = {}, options = {}) {
    return this.engine.post(endpoint, data, options);
  }

  async postForm(endpoint, formData = {}, options = {}) {
    return this.engine.postForm(endpoint, formData, options);
  }

  async put(endpoint, data = {}, options = {}) {
    return this.engine.put(endpoint, data, options);
  }

  async delete(endpoint, params = {}, options = {}) {
    return this.engine.delete(endpoint, params, options);
  }

  async patch(endpoint, data = {}, options = {}) {
    return this.engine.patch(endpoint, data, options);
  }

  // Configuration Methods
  setAuthToken(token) {
    this.engine.setAuthToken(token);
    return this;
  }

  setHeader(key, value) {
    this.engine.setHeader(key, value);
    return this;
  }

  removeHeader(key) {
    this.engine.removeHeader(key);
    return this;
  }

  setBaseURL(baseURL) {
    this.engine.setBaseURL(baseURL);
    return this;
  }

  setTimeout(timeout) {
    this.engine.setTimeout(timeout);
    return this;
  }

  // Info Methods
  getConfig() {
    return this.engine.getConfig();
  }

  getErrorMessage(status) {
    return this.engine.getErrorMessage(status);
  }
}

module.exports = NexRayAPIClient;
