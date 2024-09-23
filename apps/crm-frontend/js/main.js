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

  const POLL_INTERVAL = 3000;

  const WAIT_TIME_SEARCH = 300;

  const BUTTONS_LOAD_TIME = 1000;

  const CONTACTS_MAX = 10;

  const optionItems = [
    {type: 'phone', value: 'Телефон'},
    {type: 'email', value: 'Email'},
    {type: 'vk', value: 'VK'},
    {type: 'fb', value: 'Facebook'},
    {type: 'other', value: 'Другое'}
  ];

  const $searchInput = document.getElementById('searchTable');

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

  let sortAttribute = 'id';
  let sortNormalOrder = true;

  let timeout;

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

  // Table Sorting
  function sortTable (attribute, normalOrder) {
    clientList = clientList.sort((a, b) => (normalOrder ? a[attribute] > b[attribute] : a[attribute] < b[attribute]) ? 1 : -1)
  }

  // TODO: Doing the Searching
  // FIXME: When "NOT.includes"value || array have only one client - marginTop = !340
  function filterTable() {
    if ($searchInput.value.trim() !== "")
    clientList = clientList.filter(function(oneClient) {
      if (oneClient.id.includes($searchInput.value.trim())) return true
      if (oneClient.surname.includes($searchInput.value.trim()) || oneClient.name.includes($searchInput.value.trim()) || oneClient.lastName.includes($searchInput.value.trim())) return true
    })
  }
  
  
  // Draw Table
  function drawTable() {
    // Add margin-top to Modal-button
    const mainBtnAdd = document.querySelector('.main__btn-container');
    let marginTop = 340;
    
    let clients = document.getElementById('clientList');
    
    sortTable(sortAttribute, sortNormalOrder);
    clearTable()

    filterTable()
    
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
          
          tippy(svgContact, {
            theme: 'tooltipTheme',
            delay: 90,
            content: `<strong>${clientList[i].contacts[j].type}:</strong> ${clientList[i].contacts[j].value}`,
            allowHTML: true
          });
        }

        // Update/Delete Buttons
        tr.appendChild(td = document.createElement('td'))
        td.classList.add('td__actions');
        // Update client data
        const btnUpdateClient = document.createElement('button');
        btnUpdateClient.classList.add('tbody__td-btn', 'btn-change');
        // btnUpdateClient Animation
        const btnChangeLoad = document.createElement('span');
        btnChangeLoad.classList.add('spinner-border', 'spinner-border-sm');
        btnChangeLoad.setAttribute('role', 'status');
        btnChangeLoad.setAttribute('aria-hidden', 'true');
        btnUpdateClient.append(btnChangeLoad);
        btnUpdateClient.append('Изменить');
        btnUpdateClient.addEventListener('click', () => {
          btnUpdateClient.classList.add('btn-load-add');
          btnChangeLoad.style = 'display: inline-block';
          setTimeout(() => {
            showCreateUpdateModal(clientList[i]);
            btnUpdateClient.classList.remove('btn-load-add');
            btnChangeLoad.style = 'display: none';
          }, BUTTONS_LOAD_TIME);
        });
        td.appendChild(btnUpdateClient);

        // Delete client data
        const btnDeleteClient = document.createElement('button');
        btnDeleteClient.classList.add('tbody__td-btn', 'btn-delete');
        // btnDeleteClient Animation
        const btnDeleteLoad = document.createElement('span');
        btnDeleteLoad.classList.add('spinner-border', 'spinner-border-sm', 'red');
        btnDeleteLoad.setAttribute('role', 'status');
        btnDeleteLoad.setAttribute('aria-hidden', 'true');
        btnDeleteClient.append(btnDeleteLoad);
        btnDeleteClient.append('Удалить');
        btnDeleteClient.addEventListener('click', () => {
          btnDeleteClient.classList.add('btn-load-add');
          btnDeleteLoad.style = 'display: inline-block';
          setTimeout(() => {
            showDeleteModal(clientList[i]);
            btnDeleteClient.classList.remove('btn-load-add');
            btnDeleteLoad.style = 'display: none';
          }, BUTTONS_LOAD_TIME);
        });
        td.appendChild(btnDeleteClient);

      clients.appendChild(tr);


      // Add margin-top to Modal-button
      if (i > 0) {
        marginTop -= 60;
        mainBtnAdd.style = `margin-top: ${marginTop}px`
      } 
      if (i > 5) {
        marginTop += 60;
        mainBtnAdd.style = `margin-top: ${marginTop}px`
      }
    }

  }

  // Modal Form Validatoon

  function formValidation () {

    function removeError(input) {
      const parent = input.parentNode
  
      if (parent.classList.contains('error')) {
        parent.querySelector('.error-label').remove();
        parent.classList.remove('error');
      }
    }
  
    function createError(input, text) {
      const parent = input.parentNode
      const errorLabel = document.createElement('label');
  
      errorLabel.classList.add('error-label');
      errorLabel.textContent = text;
  
      parent.classList.add('error');
      parent.append(errorLabel);
    }

    let result = true;

    const modalAddInput = document.getElementsByClassName('.modal__add-input');

    for (const input of modalAddInput) {
      removeError(input)
      if (input.value.trim() = '') {
        createError(input)
      }
    }

    if (clientSurname.value.trim() == '' || clientSurname.value.trim().replace(REGEXP_PERSON_NAME, '') != '') {
      createError(document.getElementById('clientSurname'), 'Введите фамилию клиента')
      result = false;
    } else {
      removeError(document.getElementById('clientSurname'))
    }
    if (clientName.value.trim() == '' || clientName.value.trim().replace(REGEXP_PERSON_NAME, '') != '') {
      createError(document.getElementById('clientName'), 'Введите имя клиента')
      result = false;
    } else {
      removeError(document.getElementById('clientName'))
    }
    if (clientLastname.value.trim() == '' || clientLastname.value.trim().replace(REGEXP_PERSON_NAME, '') != '') {
      createError(document.getElementById('clientLastname'), 'Введите отчество клиента')
      result = false;
    } else {
      removeError(document.getElementById('clientLastname'))
    }

    return result
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

    const btnDeleteContactSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    btnDeleteContactSvg.classList.add('select__input-btn-arrow');
    btnDeleteContactSvg.setAttribute("viewBox", "0 0 12 12");
    btnDeleteContactSvg.setAttribute("width", 12);
    btnDeleteContactSvg.setAttribute("height", 12);
    btnDeleteContactSvg.setAttribute("fill", "none");

    const btnDeleteContactSvgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    btnDeleteContactSvgPath.setAttribute("d", "M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z");
    btnDeleteContactSvgPath.setAttribute("fill", "#B0B0B0");

    btnDeleteContactSvg.append(btnDeleteContactSvgPath);
    btnDeleteContact.append(btnDeleteContactSvg);

    btnDeleteContact.addEventListener('click', () => {
      contactContainer.remove();
    });
    contactContainer.appendChild(btnDeleteContact);

    clientContacts.appendChild(contactContainer)
    
    tippy(btnDeleteContact, {
      theme: 'tooltipTheme',
      delay: 90,
      content: "<strong>Удалить контакт</strong>",
      allowHTML: true,
    });
  }
  
  // if (clientContacts.length >= CONTACTS_MAX) modalBtnAddContact.setAttribute('disabled', '');

  function getContactsFromModal() {
    let contacts = [];
    clientContacts.querySelectorAll('div').forEach((item) => {
      console.log('TYPE:',  item.querySelector('option[selected="true"]').textContent, 'VALUE:' , item.querySelector('input').value);
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



  // Initialisation
  //    console.log('SERVER_URL: ', SERVER_URL);

    api.init('http://localhost:3000', logMessages, () => setIsLoading(false))

    pollData();
    setInterval(() => {
      pollData();
    }, POLL_INTERVAL);

    
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

    // FIXME: clientContacts.length - max 10!
    // if (clientContacts.length >= CONTACTS_MAX) {
    //   modalBtnAddContact.setAttribute('disabled');
    // }

    // if (clientContacts.length >= CONTACTS_MAX) {
    //   modalBtnAddContact.disabled = true;
    // }

    console.log(modalCreateUpdateClient);

//TODO: figure out hot to use Vanilaa JS to addEventListener
//    modalCreateUpdateClient._element.addEventListener('show.bs.modal', (e) => {
    $('#modalCreateUpdateClient').on('show.bs.modal', (e) => {

      clientContacts.replaceChildren();

      if (modalCreateUpdateClient.client) {
        modalLabel.textContent = 'Изменить данные';

        clientId.textContent = modalCreateUpdateClient.client.id;

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
      if (formValidation()) {
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

    // Sort Arrows + Default Value Activate
    document.querySelectorAll('.table-sortable').forEach( el => {
      el.addEventListener('click', (e) => {
        let newAttribute = e.target.attributes['data-attribute'].value;
        if (sortAttribute != newAttribute) {
          sortNormalOrder = true;
        } else {
          sortNormalOrder ^= true;
        }
        sortAttribute = newAttribute;
        e.target.classList.toggle('active-up', sortNormalOrder);
        e.target.classList.toggle('active-down', !sortNormalOrder);
        drawTable();
      });
    });

    // Search/Фильтрация
    $searchInput.addEventListener('input', function() {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        filterTable ()
      }, WAIT_TIME_SEARCH);
    });

  });
})();
