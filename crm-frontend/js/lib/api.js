// API

let SERVER_BASE_URL;
let SERVER_URL;
let logMessages;
let cleanupCallback;

const api = {
    init: (url, logs, callback) => {
        SERVER_BASE_URL = url;
        SERVER_URL = `${SERVER_BASE_URL}/api/clients`;
        logMessages = logs;
        cleanupCallback = (error) => {
            logMessages.push(error);
            callback();
        }
    },

    createClient: (client, callback) => {
    fetch(`${SERVER_URL}`, {
      method: 'POST',
      body: JSON.stringify({
        surname: client.surname,
        name: client.name,
        lastName: client.lastName,
        contacts: client.contacts
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error, status = ${response.status}`);
        }
        return response.json();
    })
    .then(callback)
    .catch(cleanupCallback);
    },

  updateClient: (client, callback) => {
    fetch(`${SERVER_URL}/${client.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        surname: client.surname,
        name: client.name,
        lastName: client.lastName,
        contacts: client.contacts
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error, status = ${response.status}`);
        }
        return response.json();
    })
    .then(callback)
    .catch(cleanupCallback);
},

  deleteClient: (client, callback) => {
    fetch(`${SERVER_URL}/${client.id}`, {
      method: 'DELETE',
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error, status = ${response.status}`);
        }
        return response.json();
    })
    .then(callback)
    .catch(cleanupCallback);
},

  getClients: (callback) => {
    fetch(SERVER_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error, status = ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
          callback(data);
          cleanupCallback();
      })
      .catch(cleanupCallback);
  }
}

export default api;
