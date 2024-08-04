// Включаю строгий режим, для предотвращения случайного создания глобальных переменных
'use strict';

// IIFE (вызывов функции непосредственно после ее определения)
(() => {

////////////////////////////////////////////////////////////////////////////////////////////////////
// Data
//
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////

  const SERVER_BASE_URL = 'http://localhost:3000';
  const SERVER_URL = `${SERVER_BASE_URL}/api/clients`;
  
  const REGEXP_PERSON_NAME = /(^[A-Z]{1}[a-z]{1,50}$)|(^[А-Я]{1}[а-я]{1,50}$)/;

  const optionItems = [
    {type: 'phone', value: 'Телефон'},
    {type: 'email', value: 'Email'}, 
    {type: 'vk', value: 'VK'},
    {type: 'fb', value: 'Facebook'},
    {type: 'other', value: 'Другое'}
  ];

  let clientList;
  let logMessages = [];
  let isLoading = false;

  let btnCreateClient;
  
  let modalCreateUpdateClient;
  let modalDeleteClient;
  
  let modalLabel;
  let clientId;
  let clientSurname;
  let clientName;
  let clientLastname;
  let clientContacts;

  let modalBtnAddContact;
  let modalBtnSubmit;


//TODO: cleanup the code

// function sortTable (id, typeSort, clientsList) {
  //   let sortArray = [];
  //   let sortedClientList = [];
  //   switch (id) {
  //     case 0:
  //       clientsList.forEach(client => sortArray.push(client.id));
  //       typeSort ? sortArray.sort() : sortArray.sort((a, b) => b - a);
  //       for (let i = 0; i < clientsList.length; ++i) {
  //         clientsList.forEach(client => {
  //           if (client.id === sortArray[i]) {
  //             sortedClientList.push(client);
  //           }
  //         });
  //       }
  //       clearTable();
  //       drawingTableOfClients(sortedClientList);
  //       break;
  //     case 1:
  //       clientsList.forEach(client => sortArray.push(client.surname + client.name + client.lastName));
  //       typeSort ? sortArray.sort() : sortArray.sort().reverse();
  //       for (let i = 0; i < clientsList.length; ++i) {
  //         clientsList.forEach(client => {
  //           if (sortArray[i].includes(client.surname) && sortArray[i].includes(client.name) && sortArray[i].includes(client.lastName)) {
  //             sortedClientList.push(client);
  //           }
  //         });
  //       }
  //       clearTable();
  //       drawingTableOfClients(sortedClientList);
  //       break;
  //     case 2:
  //       clientsList.forEach(client => sortArray.push(new Date(client.createdAt)));
  //       typeSort ? sortArray.sort((a, b) => a.getTime() - b.getTime()) : sortArray.sort((a, b) => b.getTime() - a.getTime());
  //       for (let i = 0; i < clientsList.length; ++i) {
  //         clientsList.forEach(client => {
  //           if (new Date(client.createdAt).getTime() === sortArray[i].getTime()) {
  //             sortedClientList.push(client);
  //           }
  //         });
  //       }
  //       clearTable();
  //       drawingTableOfClients(sortedClientList);
  //       break;
  //     case 3:
  //       clientsList.forEach(client => sortArray.push(new Date(client.updatedAt)));
  //       typeSort ? sortArray.sort((a, b) => a.getTime() - b.getTime()) : sortArray.sort((a, b) => b.getTime() - a.getTime());
  //       for (let i = 0; i < clientsList.length; ++i) {
  //         clientsList.forEach(client => {
  //           if (new Date(client.updatedAt).getTime() === sortArray[i].getTime()) {
  //             sortedClientList.push(client);
  //           }
  //         });
  //       }
  //       clearTable();
  //       drawingTableOfClients(sortedClientList);
  //       break;
  //     default:
  //       break;
  //   }
  // }



////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions
//
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////

  function setIsLoading(value) {
    isLoading = value;
    const spinner = document.getElementById("spinner");
    if (!isLoading) spinner.style = 'display: none';
    else spinner.style = 'display: block';
  }

// API

  function createClient(client, callback) {
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
  }

  function updateClient(client, callback) {
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
  }

  function deleteClient(client, callback) {
    fetch(`${SERVER_URL}/${client.id}`, {
      method: 'DELETE',
    })
    .then(callback)
    .catch((error) => {
      logMessages.push(error);
    });
  }

  function pollData() {
    if (isLoading) return;
    setIsLoading(true);
    fetch(SERVER_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error, status = ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
//FIXME: change to proper object comparision
          if (clientList !== data) {
            clientList = data;
            console.log('Got new client list:', clientList);
            clearTable();
            drawTable();
          } else {
            console.log('Data is not changed...');
          }
          setIsLoading(false);
        })
      .catch((error) => {
        logMessages.push(error);
        setIsLoading(false);
      });
  }

  // Clear Table
  function clearTable() {
    let clients = document.getElementById('clientList');
    clients.replaceChildren();
  }

  function drawTable() {
    
    let clients = document.getElementById('clientList');

    for(let i=0; i < clientList.length; i++) {
      let tr = document.createElement('tr');
      let td, span, createdAt, updatedAt;

      tr.classList.add('main__tbody-tr');

      // ID
      tr.appendChild(td = document.createElement('td'));
        td.classList.add('tbody-id', 'td-text');
        td.textContent = clientList[i].id;

      // Fullname
      tr.appendChild(td = document.createElement('td'))
        td.classList.add('td__fio');
        td.textContent = `${clientList[i].surname} ${clientList[i].name} ${clientList[i].lastName}`;

      // Created
      tr.appendChild(td = document.createElement('td'))
        createdAt = new Date(clientList[i].createdAt);
        td.classList.add('td__create');
        td.textContent = `${createdAt.getDate().toString().padStart(2, '0')}.${createdAt.getMonth().toString().padStart(2, '0')}.${createdAt.getFullYear()}`;
        span = document.createElement('span');
        span.classList.add('td-text');
        span.textContent = `${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes()}`;
        td.appendChild(span);
  
      // Updated
      tr.appendChild(td = document.createElement('td'))
        updatedAt = new Date(clientList[i].updatedAt);
        td.classList.add('td__create');
        td.textContent = `${updatedAt.getDate().toString().padStart(2, '0')}.${updatedAt.getMonth().toString().padStart(2, '0')}.${updatedAt.getFullYear()}`;
        span = document.createElement('span');
        span.classList.add('td-text');
        span.textContent = `${updatedAt.getHours().toString().padStart(2, '0')}:${updatedAt.getMinutes()}`;
        td.appendChild(span);

      // Contacts
      tr.appendChild(td = document.createElement('td'))
        td.classList.add('td__contacts');
        for(let j=0; j < clientList[i].contacts.length; j++) {
          const svgContact = document.createElement('img');
          svgContact.classList.add('tbody__td-img');
          svgContact.alt = 'contact icon';
          switch (clientList[i].contacts[j].type) {
            case 'Телефон':
              svgContact.src = 'img/contacts/phone.svg';
              break;
            case 'Email':
              svgContact.src = 'img/contacts/mail.svg';
              break;
            case 'VK':
              svgContact.src = 'img/contacts/vk.svg';
              break;
            case 'Facebook':
              svgContact.src = 'img/contacts/fb.svg';
              break;
            default:
              svgContact.src = 'img/contacts/human.svg';
              break;
          }
          td.appendChild(svgContact);
        }

        tr.appendChild(td = document.createElement('td'))
        td.classList.add('td__actions');
        const btnUpdateClient = document.createElement('button');
        btnUpdateClient.classList.add('tbody__td-btn', 'btn-change');
        btnUpdateClient.addEventListener('click', () => {
          showCreateUpdateModal(clientList[i])
        });
        td.appendChild(btnUpdateClient);

        const btnDeleteClient = document.createElement('button');
        btnDeleteClient.classList.add('tbody__td-btn', 'btn-delete');
        btnDeleteClient.addEventListener('click', () => {
          showDeleteModal(clientList[i])
        });
        td.appendChild(btnDeleteClient);


      // // Дополнения
      // if (j < 5 && clientsList[i].contacts.length >= 5) {
      //   svgContact.classList.add('top-pic');
      // }
      // if (j === 4 && !svgContact.classList.contains('last-pic')) {
      //   svgContact.classList.add('last-pic');
      // }

      clients.appendChild(tr);
    }
  }


// Modal functions

  function showCreateUpdateModal(client) {
    modalCreateUpdateClient.client = client
    modalCreateUpdateClient.show();
  }

  function showDeleteModal(client) {
    modalDeleteClient.client = client
    modalDeleteClient.show();
  }

  function addContact(contact) {
    
    console.log(contact);

    const contactContainer = document.createElement('div');
    contactContainer.classList.add('add__form-input');

    const select = document.createElement('select');
    select.classList.add('select');

    for(let i=0; i < optionItems.length; i++) {
      const option = document.createElement('option');
      option.classList.add('option');
      if (contact.type == optionItems[i].value) option.setAttribute('selected', true);
      option.setAttribute('value', optionItems[i].type);
      option.textContent = optionItems[i].value;
      select.append(option);
    };

    contactContainer.appendChild(select);

    const contactData = document.createElement('input');
    contactData.classList.add('select__input');
    contactData.setAttribute('type', 'text');
    contactData.setAttribute('placeholder', 'Введите данные контакта');
    contactData.value = contact.value;
    contactContainer.appendChild(contactData);

    const btnDeleteContact = document.createElement('button');
    btnDeleteContact.classList.add('select__input-btn');
    btnDeleteContact.setAttribute('type', 'button');
    btnDeleteContact.addEventListener('click', () => {
      contactContainer.remove();
    });
    contactContainer.appendChild(btnDeleteContact);

    clientContacts.appendChild(contactContainer)


    // contactData.addEventListener('input', () => {
    //   contactData.classList.add('edit');
    //   button.style = 'display: block';
    // });

    // const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // svg.classList.add('select__input-btn-arrow');
    // svg.setAttribute("viewBox", "0 0 12 12");
    // svg.setAttribute("width", 12);
    // svg.setAttribute("height", 12);
    // svg.setAttribute("fill", "none");

    // const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    // path.setAttribute("d", "M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z");
    // path.setAttribute("fill", "#B0B0B0");

    // svg.append(path);
    // button.append(svg);

  }
  

////////////////////////////////////////////////////////////////////////////////////////////////////
// Main
//
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////


  window.addEventListener('DOMContentLoaded', async () => {

//TODO: figure out proper error message rendering
    // const p = document.getElementById("logMessages");
    // p.replaceChildren();
    // for(let i=0; i < logMessages.length; i++) {
    //   p.appendChild(document.createTextNode(`Error: ${logMessages[i].message}`));
    // }

//TODO: global tippy call in init
  //         tippy('#select__input-delete', {
  //           theme: 'tooltipTheme',
  //           content: "<strong>Удалить контакт</strong>",
  //           allowHTML: true,
  //         });


    // Initialisation
    console.log('SERVER_URL: ', SERVER_URL);

    pollData();
    setInterval(() => {
      pollData();
    }, 5000);

    // modal init
    

    modalCreateUpdateClient = new bootstrap.Modal(document.getElementById('modalCreateUpdateClient'));
    modalDeleteClient = new bootstrap.Modal(document.getElementById('modalDeleteClient'));

    modalCreateUpdateClient.client = undefined;
    modalDeleteClient.client = undefined;

    // buttons init
    btnCreateClient = document.getElementById('btnCreateClient');
    btnCreateClient.addEventListener('click', () => showCreateUpdateModal());

    modalLabel = document.getElementById('modalLabel');
    clientId = document.getElementById('clientId');
    clientSurname = document.getElementById('clientSurname');
    clientName = document.getElementById('clientName');
    clientLastname = document.getElementById('clientLastname');
    clientContacts = document.getElementById('clientContacts');

    modalBtnAddContact = document.getElementById('modalBtnAddContact');
    modalBtnSubmit = document.getElementById('modalBtnSubmit');

    console.log(modalCreateUpdateClient);

//TODO: figure out hot to use Vanilaa JS to addEventListener
//    modalCreateUpdateClient._element.addEventListener('show.bs.modal', (e) => {
    $('#modalCreateUpdateClient').on('show.bs.modal', (e) => {

      clientContacts.replaceChildren();

      if (modalCreateUpdateClient.client) {
        modalLabel.textContent = 'Изменить данные';
        
        clientSurname.value = modalCreateUpdateClient.client.surname;
        clientName.value = modalCreateUpdateClient.client.name;
        clientLastname.value = modalCreateUpdateClient.client.lastName;

        modalCreateUpdateClient.client.contacts.forEach((contact) => {
          addContact(contact)
        })        
        modalBtnSubmit.textContent='Обновить'  
      } else {

        modalLabel.textContent = 'Новый клиент'
        clientId.value = '';
        clientSurname.value = '';
        clientName.value = '';
        clientLastname.value = '';

        modalBtnSubmit.textContent='Сохранить'  
      }
    })

    modalBtnSubmit.addEventListener("click", (e) => {
      if (modalCreateUpdateClient.client?.id) {
        updateClient({
          id: clientId.value,
          surname: clientSurname.value,
          name: clientName.value,
          lastName: clientLastname.value,
          contacts: {}
        }, (data) => {
          console.log("Client was succesfully updated", data);
          $('#modalCreateUpdateClient').modal('hide');
        })
      } else {
        createClient({
          surname: clientSurname.value,
          name: clientName.value,
          lastName: clientLastname.value,
          contacts: {}
        }, (data) => {
          console.log("Client was succesfully created", data);
          $('#modalCreateUpdateClient').modal('hide');
        })
      }
    });

    modalDeleteClientBtnSubmit.addEventListener("click", (e) => {
      deleteClient(modalDeleteClient.client, (data) => {
        console.log("Client was succesfully deleted", data);
        modalDeleteClient.hide();
//TODO: figure out why jQuery access to modal is not working
//        $('#modalDeleteClient').modal('hide');
      })
    });

    modalBtnAddContact.addEventListener('click', (e) => {
      addContact({
        "type": "Телефон",
        "value": ""
      })
    });


  });
})();
