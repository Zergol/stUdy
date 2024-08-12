////////////////////////////////////////////////////////////////////////////////////////////////////
// Data
//
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////



// Включаю строгий режим, для предотвращения случайного создания глобальных переменных
'use strict';

import api from './lib/api.js'

// IIFE (вызывов функции непосредственно после ее определения)
(() => {

////////////////////////////////////////////////////////////////////////////////////////////////////
// Data
//
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////

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

  function pollData() {
    if (isLoading) return;
    setIsLoading(true);
    api.getClients((data) => {
        //FIXME: change to proper object comparision
        if (clientList !== data) {
        clientList = data;
        console.log('Got new client list:', clientList);
        clearTable();
        drawTable();
      } else {
        console.log('Data is not changed...');
      }
      }
    )
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
        td.textContent = `${createdAt.getDate().toString().padStart(2, '0')}.${(createdAt.getMonth() + 1).toString().padStart(2, '0')}.${createdAt.getFullYear()}`;
        span = document.createElement('span');
        span.classList.add('td-text', 'td-time');
        span.textContent = `${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}`;
        td.appendChild(span);

      // Updated
      tr.appendChild(td = document.createElement('td'))
        updatedAt = new Date(clientList[i].updatedAt);
        td.classList.add('td__create');
        td.textContent = `${updatedAt.getDate().toString().padStart(2, '0')}.${(updatedAt.getMonth() + 1).toString().padStart(2, '0')}.${updatedAt.getFullYear()}`;
        span = document.createElement('span');
        span.classList.add('td-text', 'td-time');
        span.textContent = `${updatedAt.getHours().toString().padStart(2, '0')}:${updatedAt.getMinutes().toString().padStart(2, '0')}`;
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
          // tippy(id, {
          //   theme: 'tooltipTheme',
          //   content: `<strong>${clientList[i].contacts[j].type}:</strong> ${clientList[i].contacts[j].value}`,
          //   allowHTML: true
          // });
        }

        tr.appendChild(td = document.createElement('td'))
        td.classList.add('td__actions');
        const btnUpdateClient = document.createElement('button');
        btnUpdateClient.classList.add('tbody__td-btn', 'btn-change');
        btnUpdateClient.append('Изменить');
        btnUpdateClient.addEventListener('click', () => {
          showCreateUpdateModal(clientList[i])
        });
        td.appendChild(btnUpdateClient);

        const btnDeleteClient = document.createElement('button');
        btnDeleteClient.classList.add('tbody__td-btn', 'btn-delete');
        btnDeleteClient.append('Удалить');
        btnDeleteClient.addEventListener('click', () => {
          showDeleteModal(clientList[i])
        });
        td.appendChild(btnDeleteClient);

      clients.appendChild(tr);
    }
  }

  // TODO:
  // modal form validatoon
  // function formValidation (form) {

  //   function removeError(input) {
  //     const parent = input.parentNode

  //     if (parent.classList.contains('error')) {
  //       parent.querySelector('.error-label').remove();
  //       parent.classList.remove('error');
  //     }
  //   }

  //   function createError(input, text) {
  //     const parent = input.parentNode
  //     const errorLabel = document.createElement('label');

  //     errorLabel.classList.add('error-label');
  //     errorLabel.textContent = text;

  //     parent.classList.add('error');
  //     parent.append(errorLabel);
  //   }

  //   let result = true;

  //   const modalInputs = form.querySelectorAll('modal__add-input');

  //   for (const input of modalInputs) {
  //     removeError(input)
  //     if (input.value.trim() = '') {
  //       createError(input)
  //     }
  //   }

  //   if (clientSurname.value.trim() == '' || clientSurname.value.trim().replace(REGEXP_PERSON_NAME, '') != '') {
  //     createError(document.getElementById('clientSurname'), 'Введите фамилию клиента')
  //     result = false;
  //   }
  //   if (clientName.value.trim() == '' || clientName.value.trim().replace(REGEXP_PERSON_NAME, '') != '') {
  //     createError(document.getElementById('clientName'), 'Введите имя клиента')
  //     result = false;
  //   }
  //   if (clientLastname.value.trim() == '' || clientLastname.value.trim().replace(REGEXP_PERSON_NAME, '') != '') {
  //     createError(document.getElementById('clientName'), 'Введите отчество клиента')
  //     result = false;
  //   }

  //   return result
  // }


// Modal functions

  function showCreateUpdateModal(client) {
    modalCreateUpdateClient.client = client
    modalCreateUpdateClient.show();
  }

  function showDeleteModal(client) {
    modalDeleteClient.client = client
    modalDeleteClient.show();
  }

  function addContactToModal(contact) {

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

  }

  function getContactsFromModal() {
    let contacts = [];
    clientContacts.querySelectorAll('div').forEach((item) => {
        console.log('TYPE:',  item.querySelector('option[selected="true"]').textContent, 'VALUE:' , item.querySelector('input').value)
        contacts.push({
          "type": item.querySelector('option:checked').textContent,
          "value": item.querySelector('input').value
        })
    });
    return contacts;
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
//    console.log('SERVER_URL: ', SERVER_URL);

    api.init('http://localhost:3000', logMessages, () => setIsLoading(false))

    pollData();
    setInterval(() => {
      pollData();
    }, 3000);

    
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

        clientId.textContent = 'ID:' + modalCreateUpdateClient.client.id;

        clientSurname.value = modalCreateUpdateClient.client.surname;
        clientName.value = modalCreateUpdateClient.client.name;
        clientLastname.value = modalCreateUpdateClient.client.lastName;

        modalCreateUpdateClient.client.contacts.forEach((contact) => {
          addContactToModal(contact)
        })
        modalBtnSubmit.textContent='Сохранить'
      } else {

        modalLabel.textContent = 'Новый клиент'
        clientId.textContent = '';
        clientSurname.value = '';
        clientName.value = '';
        clientLastname.value = '';

        modalBtnSubmit.textContent='Сохранить'
      }
    })

    modalBtnSubmit.addEventListener("click", (e) => {
      if (modalCreateUpdateClient.client?.id) {
        api.updateClient({
          id: clientId.textContent,
          surname: clientSurname.value,
          name: clientName.value,
          lastName: clientLastname.value,
          contacts: getContactsFromModal(),
        }, (data) => {
          console.log("Client was succesfully updated", data);
          modalCreateUpdateClient.hide();
        })
      } else {
        api.createClient({
          surname: clientSurname.value,
          name: clientName.value,
          lastName: clientLastname.value,
          contacts: getContactsFromModal(),
        }, (data) => {
          console.log("Client was succesfully created", data);
          modalCreateUpdateClient.hide();
        })
      }
    });

    modalDeleteClientBtnSubmit.addEventListener("click", (e) => {
      api.deleteClient(modalDeleteClient.client, (data) => {
        console.log("Client was succesfully deleted", data);
        modalDeleteClient.hide();
//TODO: figure out why jQuery access to modal is not working
//        $('#modalDeleteClient').modal('hide');
      })
    });

    modalBtnAddContact.addEventListener('click', (e) => {
      addContactToModal({
        "type": "Телефон",
        "value": ""
      })
    });

  });
})();
