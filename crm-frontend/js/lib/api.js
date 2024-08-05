// API

const api = {
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
    .then(callback)
    .catch((error) => {
      logMessages.push(error);
    });
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
    .then(callback)
    .catch((error) => {
      logMessages.push(error);
    });
  },

  deleteClient: (client, callback) => {
    fetch(`${SERVER_URL}/${client.id}`, {
      method: 'DELETE',
    })
    .then(callback)
    .catch((error) => {
      logMessages.push(error);
    });
  },

  getClients: (callback, cleanupCallback) => {
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
      .catch((error) => {
        logMessages.push(error);
        cleanupCallback();
      });
  }
}

export default api;
