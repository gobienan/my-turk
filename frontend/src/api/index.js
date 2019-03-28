const SERVER_URL = 'http://localhost:3000/api/mturk/'

export default {
  login: payload => {
    return sendData('login', payload)
  },

  addExperiment: payload => {
    return sendData('addExperiment', payload)
  },

  saveSettings: payload => {
    return sendData('saveExperiment', payload)
  },

  getExperiments: payload => {
    return sendData('getExperiments', payload)
  },

  deleteExperiment: payload => {
    return sendData('deleteExperiment', payload)
  },

  createHIT: payload => {
    return sendData('createHIT', payload)
  },

  getHIT: payload => {
    return sendData('getHIT', payload)
  },

  deleteHIT: payload => {
    return sendData('deleteHIT', payload)
  },

  listAssignments: payload => {
    return sendData('listAssignments', payload)
  },

  approveAssignment: payload => {
    return sendData('approveAssignment', payload)
  },

  rejectAssignment: payload => {
    return sendData('rejectAssignment', payload)
  },
}

/**
 * GET Request.
 * @param {String} endpoint.
 * @return {Object} The result of the request.
 */
function getData(endpoint) {
  let options = {
    endpoint: SERVER_URL + endpoint,
    method: 'GET',
  }

  return request(options)
}

/**
 * POST Request.
 * @param {String} endpoint.
 * @param {Object} payload is the body data.
 * @return {Object} The result of the request.
 */
function sendData(endpoint, payload) {
  let options = {
    endpoint: SERVER_URL + endpoint,
    method: 'POST',
    payload: payload,
  }

  return request(options)
}

/**
 * Fetch function for get and post requests.
 * All requests are synchronous right now.
 * @param {options} .
 * @return {Object} The result of the request.
 */
async function request({ endpoint, method, payload }) {
  let options = {}
  if (method === 'GET') {
    options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  } else {
    options = {
      method: method,
      body: JSON.stringify(payload) || '',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  }

  let response = fetch(endpoint, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Not 200 response')
      }
      return response.json()
    })
    .then(json => {
      return json
    })
    .catch(error => {
      console.error('Error:', error)
      return false
    })

  return response
}
