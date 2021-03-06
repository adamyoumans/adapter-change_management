// Update this constant with your ServiceNow credentials
const options = {
  url: 'https://dev64996.service-now.com/',
  username: 'admin',
  password: 'hbLZT6Gsvz9X'
};


/**
 * Import the Node.js request package.
 * See https://www.npmjs.com/package/request
 */
const request = require('request');

// We'll use this regular expression to verify REST API's HTTP response status code.
const validResponseRegex = /(2\d\d)/;

// Use JSDoc to create a JSDoc data type for an IAP callback.
// Call the new type iapCallback.
// Notice iapCallback is a data-first callback.

/**
 * @callback iapCallback
 * @description A [callback function]{@link
 *   https://developer.mozilla.org/en-US/docs/Glossary/Callback_function}
 *   is a function passed into another function as an argument, which is
 *   then invoked inside the outer function to complete some kind of
 *   routine or action.
 *
 * @param {*} responseData - When no errors are caught, return data as a
 *   single argument to callback function.
 * @param {error} [errorMessage] - If an error is caught, return error
 *   message in optional second argument to callback function.
 */


/**
 * @function constructUri
 * @description Build and return the proper URI by appending an optionally passed
 *   [URL query string]{@link https://en.wikipedia.org/wiki/Query_string}.
 *
 * @param {string} serviceNowTable - The table target of the ServiceNow table API.
 * @param {string} [query] - Optional URL query string.
 *
 * @return {string} ServiceNow URL
 */
function constructUri(serviceNowTable, query = null) {
  let uri = `/api/now/table/${serviceNowTable}`;
  if (query) {
    uri = uri + '?' + query;
  }
  return uri;
}


/**
 * @function isHibernating
 * @description Checks if request function responded with evidence of
 *   a hibernating ServiceNow instance.
 *
 * @param {object} response - The response argument passed by the request function in its callback.
 *
 * @return {boolean} Returns true if instance is hibernating. Otherwise returns false.
 */
function isHibernating(response) {
  return response.body.includes('Instance Hibernating page')
  && response.body.includes('<html>')
  && response.statusCode === 200;
}


/**
 * @function processRequestResults
 * @description Inspect ServiceNow API response for an error, bad response code, or
 *   a hibernating instance. If any of those conditions are detected, return an error.
 *   Else return the API's response.
 *
 * @param {error} error - The error argument passed by the request function in its callback.
 * @param {object} response - The response argument passed by the request function in its callback.
 * @param {string} body - The HTML body argument passed by the request function in its callback.
 * @param {iapCallback} callback - Callback a function.
 * @param {(object|string)} callback.data - The API's response. Will be an object if sunnyday path.
 *   Will be HTML text if hibernating instance.
 * @param {error} callback.error - The error property of callback.
 */
function processRequestResults(error, response, body, callback) {
 let callbackData = null;
  let callbackError = null;

  // Construct API call to send to ServiceNow.
  // The request constructor has an options parameter
  // that holds the HTTP request method, credentials, and the API's URL.
  // Some properties are hardcoded, like the method and part of the URI.
  // Some properties are read from global const options.
  // Some properties are passed into function get() through parameters.
  const requestOptions = {
    method: 'GET',
    auth: {
      user: options.username,
      pass: options.password,
    },
    baseUrl: options.url,
    uri: `/api/now/table/${serviceNowTable}?sysparm_limit=1`,
  };

  // Send Request to ServiceNow.
  // We are passing variable requestOptions for the first argument.
  // We are passing an anonymous function, an error-first callback,
  // for the second argument.
  request(requestOptions, (error, response, body) => {
    /**
     * Process ServiceNow error, response and body.
     * Check error and response code to make sure
     * response is good.
     */
    if (error) {
      console.error('Error present.');
      callbackError = error;
    } else if (!validResponseRegex.test(response.statusCode)) {
      console.error('Bad response code.');
      callbackError = response;
      console.error(callbackError);
    } else {
      callbackData = response;
    }
    return callback(callbackData, callbackError);
  });

}

/**
 * @function post
 * @description Call the ServiceNow GET API.
 *
 * @param {string} serviceNowTable - The table target of the ServiceNow table API.
 * @param {iapCallback} callback - Callback a function.
 * @param {*} callback.data - The API's response. Will be an object if sunnyday path.
 *   Will be HTML text if hibernating instance.
 * @param {error} callback.error - The error property of callback.
 */
function post(serviceNowTable, callback) {

  // Initialize return arguments for callback
  let callbackData = null;
  let callbackError = null;

  // Construct API call to send to ServiceNow.
  // The request constructor has an options parameter
  // that holds the HTTP request method, credentials, and the API's URL.
  // Some properties are hardcoded, like the method and part of the URI.
  // Some properties are read from global const options.
  // Some properties are passed into function post() through parameters.
  const requestOptions = {
    method: 'POST',
    auth: {
      user: options.username,
      pass: options.password,
    },
    baseUrl: options.url,
    uri: `/api/now/table/${serviceNowTable}`,
  };

  // Send Request to ServiceNow.
  // We are passing variable requestOptions for the first argument.
  // We are passing an anonymous function, an error-first callback,
  // for the second argument.
  request(requestOptions, (error, response, body) => {
    /**
     * Process ServiceNow error, response and body.
     * Check error and response code to make sure
     * response is good.
     */
    if (error) {
      console.error('Error present.');
      callbackError = error;
    } else if (!validResponseRegex.test(response.statusCode)) {
      console.error('Bad response code.');
      callbackError = response;
      console.error(callbackError);
    } else {
      callbackData = response;
    }
    return callback(callbackData, callbackError);
  });

}


/**
 * @function get
 * @description Call the ServiceNow GET API. Sets the API call's method and query,
 *   then calls sendRequest().
 *
 * @param {object} callOptions - Passed call options.
 * @param {string} callOptions.serviceNowTable - The table target of the ServiceNow table API.
 * @param {iapCallback} callback - Callback a function.
 * @param {(object|string)} callback.data - The API's response. Will be an object if sunnyday path.
 *   Will be HTML text if hibernating instance.
 * @param {error} callback.error - The error property of callback.
 */
function get(callOptions, callback) {
  callOptions.method = 'GET';
  callOptions.query = 'sysparm_limit=1';
  sendRequest(callOptions, (results, error) => callback(results, error));
}

/**
 * @function post
 * @description Call the ServiceNow POST API. Sets the API call's method,
 *   then calls sendRequest().
 *
 * @param {object} callOptions - Passed call options.
 * @param {string} callOptions.serviceNowTable - The table target of the ServiceNow table API.
 * @param {iapCallback} callback - Callback a function.
 * @param {(object|string)} callback.data - The API's response. Will be an object if sunnyday path.
 *   Will be HTML text if hibernating instance.
 * @param {error} callback.error - The error property of callback.
 */
function post(callOptions, callback) {
  callOptions.method = 'POST';
  sendRequest(callOptions, (results, error) => callback(results, error));
}


/**
 * @function main
 * @description Tests get() and post() functions.
 */
function main() {
  get({ serviceNowTable: 'change_request' }, (data, error) => {
    if (error) {
      console.error(`\nError returned from GET request:\n${JSON.stringify(error)}`);
    }
    console.log(`\nResponse returned from GET request:\n${JSON.stringify(data)}`)
  });
  post({ serviceNowTable: 'change_request' }, (data, error) => {
    if (error) {
      console.error(`\nError returned from POST request:\n${JSON.stringify(error)}`);
    }
    console.log(`\nResponse returned from POST request:\n${JSON.stringify(data)}`)
  });
}


// Call main to run it.
main();