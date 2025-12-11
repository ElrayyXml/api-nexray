const axios = require('axios');
const config = require('./config.json');

const options = {
    baseURL: config.baseURL,
    timeout: config.timeout,
    maxRetries: config.maxRetries,
    headers: {
        'User-Agent': config.userAgent,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

const client = axios.create();

client.defaults.baseURL = options.baseURL;
client.defaults.timeout = options.timeout;
client.defaults.headers.common = options.headers;

client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (!originalRequest || !options.maxRetries) {
            return Promise.reject(error);
        }
        originalRequest.__retryCount = originalRequest.__retryCount || 0;
        if (originalRequest.__retryCount >= options.maxRetries) {
            return Promise.reject(error);
        }
        originalRequest.__retryCount += 1;
        await new Promise(resolve => setTimeout(resolve, 1000));
        return client(originalRequest);
    }
);

const formatEndpoint = (endpoint) => {
    return endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
};

const handleError = (error) => {
    const result = {
        status: false,
        author: config.author
    };

    if (error.response) {
        const status = error.response.status;
        if (status === 500) {
            result.error = '500 Internal Server Error - Server encountered an error';
        } else if (status === 400) {
            result.error = '400 Bad Request - Invalid parameters or missing required fields';
        } else {
            result.error = error.response.data.message || error.message;
        }
    } else {
        result.error = error.message || 'Network Error';
    }

    return result;
};

const nexray = {
    setOptions: (newOptions = {}) => {
        if (newOptions.baseURL) client.defaults.baseURL = newOptions.baseURL;
        if (newOptions.timeout) client.defaults.timeout = newOptions.timeout;
        if (newOptions.maxRetries !== undefined) options.maxRetries = newOptions.maxRetries;
        if (newOptions.headers) {
            client.defaults.headers.common = {
                ...client.defaults.headers.common,
                ...newOptions.headers
            };
        }
    },

    get: async (endpoint, params = {}) => {
        try {
            const response = await client.get(formatEndpoint(endpoint), { params });
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    post: async (endpoint, data = {}) => {
        try {
            const response = await client.post(formatEndpoint(endpoint), data);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    getBuffer: async (endpoint, params = {}) => {
        try {
            const response = await client.get(formatEndpoint(endpoint), {
                params,
                responseType: 'arraybuffer'
            });
            return Buffer.from(response.data);
        } catch (error) {
            return handleError(error);
        }
    }
};

module.exports = nexray;
module.exports.default = nexray;
