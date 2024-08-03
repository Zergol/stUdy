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

  let clientList;
  let logMessages = [];
  let isLoading = false;

  // ТулТип
  function addToolTip(clientsList) {
    for (let i = 0; i < clientsList.length; ++i) {
      for (let j = 0; j < clientsList[i].contacts.length; ++j) {
        let id = '#';
        switch (clientsList[i].contacts[j].type) {
          case 'Телефон':
            id += 'phone' + i + j;
            break;
          case 'Email':
            id += 'email' + i + j;
            break;
          case 'VK':
            id += 'vk' + i +j;
            break;
          case 'Facebook':
            id += 'fb' + i + j;
            break;
          default:
            id += 'other' + i + j;
            break;
        }

        tippy(id, {
          theme: 'tooltipTheme',
          content: `<strong>${clientsList[i].contacts[j].type}:</strong> ${clientsList[i].contacts[j].value}`,
          allowHTML: true
        });
      }
    }
  }

  // function addActionsToModalWindow (key) {
  //   const addActionsToInputs = (inputs, inputsLabel) => {
  //     inputs.forEach(input => {
  //      inputsLabel.forEach(label => {
  //       if (input.id == label.getAttribute('for')) {
  //         input.addEventListener('input', () => {
  //           label.classList.add('focus-label');
  //           if (!input.value) {
  //             label.classList.remove('focus-label');
  //           }
  //         });
  //       }
  //      });
  //     });
  //   };

  //   const addActionsToBtn = className => {
  //     const modalAddContact = document.querySelector(className.first);
  //     let counterOfAddedContacts = 0;
  //     modalAddContact.addEventListener('click', () => {
  //       modalAddContact.style = 'margin-bottom: 25px';
  //       if (counterOfAddedContacts < 10) {
  //         const modalAddForm = document.querySelector(className.second);
  //         modalAddForm.style = 'margin-top 25px';
  //         const addFormInput = document.createElement('div');
  //         addFormInput.classList.add('add__form-input');

  //         const select = document.createElement('select');
  //         select.classList.add('select');

  //         const ListOptionsItem = ['Телефон', 'Email', 'VK', 'Facebook', 'Другое'];
  //         const ListOptionsValue = ['phone', 'email', 'vk', 'fb', 'other'];
  //         for (let i = 0; i < ListOptionsItem.length; ++i) {
  //           const option = document.createElement('option');
  //           option.classList.add('option');
  //           if (!i) option.setAttribute('selected', true);
  //           option.setAttribute('value', ListOptionsValue[i]);
  //           option.textContent = ListOptionsItem[i];
  //           select.append(option);
  //         }

  //         const input = document.createElement('input');
  //         input.classList.add('select__input');
  //         input.setAttribute('type', 'text');
  //         input.setAttribute('placeholder', 'Введите данные контакта');

  //         const button = document.createElement('button');
  //         button.classList.add('select__input-btn');
  //         button.setAttribute('type', 'button');
  //         button.id = 'select__input-delete';
  //         button.style = 'display: none';

  //         input.addEventListener('input', () => {
  //           input.classList.add('edit');
  //           button.style = 'display: block';
  //         });

  //         const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  //         svg.classList.add('select__input-btn-arrow');
  //         svg.setAttribute("viewBox", "0 0 12 12");
  //         svg.setAttribute("width", 12);
  //         svg.setAttribute("height", 12);
  //         svg.setAttribute("fill", "none");

  //         const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  //         path.setAttribute("d", "M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z");
  //         path.setAttribute("fill", "#B0B0B0");

  //         svg.append(path);
  //         button.append(svg);

  //         button.addEventListener('click', () => {
  //           addFormInput.remove();
  //           --counterOfAddedContacts;
  //           if (counterOfAddedContacts == 9) {
  //             modalAddContact.style = 'display: block';
  //             modalAddContact.style = 'margin-bottom: 25px';
  //           }
  //           if (!counterOfAddedContacts) {
  //             modalAddContact.style = 'margin-bottom: 0px';
  //             modalAddForm.style = 'margin-top: 0px';
  //           }
  //         });

  //         addFormInput.append(select);
  //         addFormInput.append(input);
  //         addFormInput.append(button);
  //         modalAddForm.append(addFormInput);

  //         $('.add__form-input select').selectpicker();
  //         tippy('#select__input-delete', {
  //           theme: 'tooltipTheme',
  //           content: "<strong>Удалить контакт</strong>",
  //           allowHTML: true,
  //         });

  //         ++counterOfAddedContacts;
  //       }
  //       if (counterOfAddedContacts === 10) {
  //         modalAddContact.style = 'display: none';
  //       }
  //     });
  //   };

  //   switch (key) {
  //     case 1:
  //       // Изменить данные клиента
  //       const inputs1 = document.querySelectorAll('.modal__change-input');
  //       const inputsLabel1 = document.querySelectorAll('.modal__change-label');
  //       addActionsToInputs(inputs1, inputsLabel1);
  //       break;
  //     case 2:
  //       // Добавить клиента
  //       const inputs2 = document.querySelectorAll('.modal__add-input');
  //       const inputsLabel2 = document.querySelectorAll('.modal__add-label');
  //       addActionsToInputs(inputs2, inputsLabel2);
  //       break;
  //     case 3:
  //       // Кнопка "Добавить контакт" из "Изменить данные клиента"
  //       addActionsToBtn({
  //         first: '.footer__btn-change',
  //         second: '.modal__change-form'
  //       });
  //       break;
  //     case 4:
  //       // Кнопка "Добавить контакт" из "Добавить клиента"
  //       addActionsToBtn({
  //         first: '.footer__btn-add',
  //         second: '.modal__add-form'
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  // }

  // Запрос списка добавленных клиентов
  // async function getListOfClients(SERVER_URL) {
  //   try {
  //     const response = await fetch(SERVER_URL);
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.log('Error message', error.message);
  //   }
  // }

  // Отрисовка таблицы
  // function drawingTableOfClients(clientsList) {
  //   const mainBtnAdd = document.querySelector('.main__btn-container');
  //   let marginTop = 340;

  //   // цикл по каждому клиенту в массиве
  //   for (let i = 0; i < clientsList.length; ++i) {
  //     const spinner = document.querySelector('.spinner-border');

  //     // 10.07.2024 - внёс
  //     if (clientsList) {
  //       spinner.style = 'display: none';
  //     }

  //     // создаем строку с данными клиента
  //     const tbodyTr = document.createElement('tr');
  //     tbodyTr.classList.add('main__tbody-tr');

  //     // добавляем данные в строку
  //     for (let key = 0; key < 6; ++key) {
  //       const tbodyTd = document.createElement('td');
  //       tbodyTd.classList.add('main__tbody-td');

  //       switch(key) {
  //         case 0:
  //           tbodyTd.classList.add('tbody-id', 'td-text');
  //           tbodyTd.textContent = Math.trunc(clientsList[i].id / 10000000);
  //           break;
  //         case 1:
  //           tbodyTd.classList.add('td__fio');
  //           tbodyTd.textContent = clientsList[i].surname + ' ' + clientsList[i].name;
  //           if (clientsList[i].lastName) {
  //             tbodyTd.textContent += ' ' + clientsList[i].lastName;
  //           }
  //           break;
  //         case 2:
  //           tbodyTd.classList.add('td__create');
  //           const date = new Date(clientsList[i].createdAt);
  //           tbodyTd.textContent = '';
  //           if (date.getDate() < 10) {
  //             tbodyTd.textContent = '0';
  //           }
  //           tbodyTd.textContent += `${date.getDate()}.`;
  //           if (date.getMonth() < 9) {
  //             tbodyTd.textContent += '0';
  //           }
  //           tbodyTd.textContent += `${date.getMonth() + 1}.${date.getFullYear()} `;

  //           const span = document.createElement('span');
  //           span.classList.add('td-text');
  //           span.textContent = `${date.getHours()}:`;
  //           if (date.getMinutes() < 10) {
  //             span.textContent += '0';
  //           }
  //           span.textContent += date.getMinutes();
  //           tbodyTd.append(span);
  //           break;
  //         case 3:
  //           tbodyTd.classList.add('td__change');
  //           const date2 = new Date(clientsList[i].updatedAt);
  //           tbodyTd.textContent = '';
  //           if (date2.getDate() < 10) {
  //             tbodyTd.textContent = '0';
  //           }
  //           tbodyTd.textContent += `${date2.getDate()}.`;
  //           if (date2.getMonth() < 9) {
  //             tbodyTd.textContent += '0';
  //           }
  //           tbodyTd.textContent += `${date2.getMonth() + 1}.${date2.getFullYear()} `;

  //           const span2 = document.createElement('span');
  //           span2.classList.add('td-text');
  //           span2.textContent = `${date2.getHours()}:`;
  //           if (date2.getMinutes() < 10) {
  //             span2.textContent += '0';
  //           }
  //           span2.textContent += date2.getMinutes();
  //           tbodyTd.append(span2);
  //           break;
  //         case 4:
  //           tbodyTd.classList.add('td__contacts');
  //           for (let j = 0; j < clientsList[i].contacts.length; ++j) {
  //             const svgContact = document.createElement('img');
  //             svgContact.classList.add('tbody__td-img');
  //             svgContact.alt = 'contact icon';
  //             switch (clientsList[i].contacts[j].type) {
  //               case 'Телефон':
  //                 svgContact.id = 'phone' + i + j;
  //                 svgContact.src = 'img/contacts/phone.svg';
  //                 break;
  //               case 'Email':
  //                 svgContact.id = 'email' + i + j;
  //                 svgContact.src = 'img/contacts/mail.svg';
  //                 break;
  //               case 'VK':
  //                 svgContact.id = 'vk' + i + j;
  //                 svgContact.src = 'img/contacts/vk.svg';
  //                 break;
  //               case 'Facebook':
  //                 svgContact.id = 'fb' + i + j;
  //                 svgContact.src = 'img/contacts/fb.svg';
  //                 break;
  //               default:
  //                 svgContact.id = 'other' + i + j;
  //                 svgContact.src = 'img/contacts/human.svg';
  //                 break;
  //             }
  //             // Дополнения
  //             if (j < 5 && clientsList[i].contacts.length >= 5) {
  //               svgContact.classList.add('top-pic');
  //             }
  //             if (j === 4 && !svgContact.classList.contains('last-pic')) {
  //               svgContact.classList.add('last-pic');
  //             }
  //             tbodyTd.append(svgContact);
  //           }
  //           break;
  //         case 5:
  //           tbodyTd.classList.add('td__actions');
  //           // Изменение данных клиента (кнопка в строке)
  //           const btnChange = document.createElement('button');
  //           btnChange.classList.add('tbody__td-btn', 'btn-change');
  //             // btn-change loading animation
  //           const btnChangeLoad = document.createElement('span');
  //           btnChangeLoad.classList.add('spinner-border', 'spinner-border-sm');
  //           btnChangeLoad.setAttribute('role', 'status');
  //           btnChangeLoad.setAttribute('aria-hidden', 'true');
  //           btnChange.append(btnChangeLoad);
  //           btnChange.append('Изменить');
  //           btnChange.addEventListener('click', () => {
  //             const modal = new bootstrap.Modal(document.querySelector('#changeModal'));
  //             btnChange.classList.add('btn-load-add');
  //             btnChangeLoad.style = 'display: inline-block';
  //             setTimeout(() => {
  //               modal.show();
  //               btnChange.classList.remove('btn-load-add');
  //               btnChangeLoad.style = 'display: none';
  //             }, 1000);

  //             // Кнопка "закрыть окно"
  //             const btnClose = document.querySelector('.modal__change-btn');
  //             btnClose.addEventListener('click', () => modal.hide());

  //             const clientID = document.querySelector('.modal__change-id');
  //             clientID.textContent = `ID: ${Math.trunc(clientsList[i].id / 10000000)}`;
  //             // input value - FIO
  //             const inputValue = document.querySelectorAll('.modal__change-input');
  //             const inputLabel = document.querySelectorAll('.modal__change-label');
  //             inputValue[0].value = clientsList[i].surname;
  //             inputLabel[0].classList.add('focus-label');
  //             inputValue[1].value = clientsList[i].name;
  //             inputLabel[1].classList.add('focus-label');
  //             inputValue[2].value = clientsList[i].lastName;
  //             if (clientsList[i].lastName) {
  //               inputLabel[2].classList.add('focus-label');
  //             } else {
  //               inputLabel[2].classList.remove('focus-label');
  //             }

  //             // модалка Change
  //             const btnChangeModal = document.querySelector('.footer__btn-save-change');
  //             btnChangeModal.addEventListener('click', async (e) => {
  //               e.preventDefault();

  //               const clientSurname = document.getElementById('input-surname-2');
  //               const clientName = document.getElementById('input-name-2');
  //               const clientLastName = document.getElementById('input-lastName-2');

  //               function removeError (input) {
  //                 const parent = input.parentNode

  //                 if (parent.classList.contains('input-error')) {
  //                   parent.querySelector('.error-label').remove()
  //                   parent.classList.remove('input-error')
  //                 }
  //               }

  //               function createError (input, text) {
  //                 const parent = input.parentNode
  //                 const errorLabel = document.createElement('label')

  //                 errorLabel.classList.add('error-label')
  //                 errorLabel.textContent = text

  //                 parent.classList.add('input-error')
  //                 parent.append(errorLabel)
  //               }

  //               let isChecked = false;
  //               const allInputs = document.getElementsByClassName('modal__change-input');

  //               for (const input of allInputs) {
  //                 removeError(input)
  //                 if(input.value.trim() == '') {
  //                   createError(input)
  //                 }
  //               }

  //               if (clientSurname.value.trim() == '' || clientSurname.value.trim().replace(REGEXP_PERSON_NAME, '') != '') {
  //                 createError(document.getElementById('input-surname-2'), 'Введите фамилию клиента')
  //                 isChecked = true;
  //               }
  //               if (clientName.value.trim() == '' || clientName.value.trim().replace(REGEXP_PERSON_NAME, '') != '') {
  //                 createError(document.getElementById('input-name-2'), 'Введите имя клиента')
  //                 isChecked = true;
  //               }
  //               if (clientLastName.value.trim() == '' || clientLastName.value.trim().replace(REGEXP_PERSON_NAME, '') != '') {
  //                 createError(document.getElementById('input-lastName-2'), 'Введите отчество клиента')
  //                 isChecked = true;
  //               }
  //               if (isChecked) return;

  //               const spinner = document.querySelector('.spinner-change');
  //               spinner.style.display = 'inline-block';
  //               btnChangeModal.classList.add('add-spinner');

  //               // Ненавистный список контактов
  //               const listTypes = document.querySelectorAll('.filter-option-inner-inner');
  //               const listValues = document.querySelectorAll('.select__input');
  //               let contacts = [];
  //               for (let i = 0; i < listTypes.length; ++i) {
  //                 if (!listValues[i].value) continue;
  //                 contacts.push({
  //                   type: listTypes[i].textContent,
  //                   value: listValues[i].value.trim()
  //                 });
  //               }

  //               setTimeout(async () => {
  //                 await fetch(`${SERVER_URL}/${clientsList[i].id}`, {
  //                   method: 'PATCH',
  //                   body: JSON.stringify({
  //                     surname: clientSurname.value.trim(),
  //                     name: clientName.value.trim(),
  //                     lastName: clientLastName.value.trim(),
  //                     contacts: contacts
  //                   }),
  //                   headers: { 'Content-Type': 'application/json' },
  //                 }),

  //                 // loading animation - убираем
  //                 spinner.style.display = 'none';
  //                 btnChangeModal.classList.remove('add-spinner');

  //                 clearModal(2);
  //                 addActionsToModalWindow(3);
  //                 modal.hide();
  //                 // Отрисовываю таблицу
  //                 const clientListNew = await getListOfClients(SERVER_URL);
  //                 clearTable();
  //                 drawingTableOfClients(clientListNew);
  //               }, 1000);
  //             });

  //             // Удаление
  //             const btnDeleteModal = document.querySelector('.footer__btn-cancel-change');
  //             btnDeleteModal.addEventListener('click', async (e) => {
  //               e.preventDefault();
  //               tbodyTr.remove();
  //               await fetch(`${SERVER_URL}/${clientsList[i].id}`, {
  //                 method: 'DELETE',
  //               });
  //               modal.hide();
  //               // Отрисовываю таблицу
  //               const clientListNew = await getListOfClients(SERVER_URL);
  //               clearTable();
  //               drawingTableOfClients(clientListNew);
  //             });
  //           });

  //           // Удаление клиента (кнопка в строке)
  //           const btnDelete = document.createElement('button');
  //           btnDelete.classList.add('tbody__td-btn', 'btn-delete');
  //           //  btn-delete loading animation
  //           const btnDeleteLoad = document.createElement('span');
  //           btnDeleteLoad.classList.add('spinner-border', 'spinner-border-sm', 'red');
  //           btnDeleteLoad.setAttribute('role', 'status');
  //           btnDeleteLoad.setAttribute('aria-hidden', 'true');
  //           btnDelete.append(btnDeleteLoad);
  //           btnDelete.append('Удалить');
  //           btnDelete.addEventListener('click', () => {
  //             const modal = new bootstrap.Modal(document.querySelector('#deleteModal'));
  //             btnDelete.classList.add('btn-load-add');
  //             btnDeleteLoad.style = 'display: inline-block';
  //             setTimeout(() => {
  //               modal.show();
  //               btnDelete.classList.remove('btn-load-add');
  //               btnDeleteLoad.style = 'display: none';
  //             }, 1000);

  //             // Кнопка "закрыть окно"
  //             const btnClose = document.querySelector('.modal__delete-btn');
  //             btnClose.addEventListener('click', () => modal.hide());

  //             // Отменить
  //             const btnCancel = document.querySelector('.modal__delete-cancel');
  //             btnCancel.addEventListener('click', () => modal.hide());

  //             // Удалить с кнопки
  //             const btnDeleteModal = document.querySelector('.modal__delete-second-btn');
  //             btnDeleteModal.addEventListener('click', async () => {
  //               tbodyTr.remove();
  //               await fetch(`${SERVER_URL}/${clientsList[i].id}`, {
  //                 method: 'DELETE',
  //               });
  //               modal.hide();
  //               // Отрисовываю таблицу
  //               const clientListNew = await getListOfClients(SERVER_URL);
  //               clearTable();
  //               drawingTableOfClients(clientListNew);
  //             });
  //           });

  //           tbodyTd.append(btnChange);
  //           tbodyTd.append(btnDelete);
  //           break;
  //         default:
  //           break;
  //       }
  //       tbodyTr.append(tbodyTd);
  //     }

  //     // Добавить строку в таблицу
  //     const tableTbody = document.querySelector('.main__table-tbody');
  //     tableTbody.append(tbodyTr);

  //     // велосипед
  //     if (i < 5) {
  //       marginTop -= 60;
  //       mainBtnAdd.style = `margin-top: ${marginTop}px`
  //     }
  //   }

  //   addToolTip(clientsList);
  // }

  // Clear Modal
  function clearModal(key) {
    let listClassNames;
    if (key == 1) {
      // Добавить клиента
      listClassNames = {
        first: 'modal__add-input',
        second: 'footer__btn-add',
        third: 'modal__add-form',
        fourth: 'modal__add-main-btn'
      };
    } else if (key == 2) {
      // Изменить данные клиента
      listClassNames = {
        first: 'modal__change-input',
        second: 'footer__btn-change',
        third: 'modal__change-form',
        fourth: 'modal__change-main-btn'
      };
    }

    // Labels
    const labels = document.querySelectorAll('.modal__add-label');
    labels.forEach(label => {
      if (label.classList.contains('focus-label')) {
        label.classList.remove('focus-label');
      }
    });

    // inputs
    let inputs = document.querySelectorAll(`.${listClassNames.first}`);
    inputs.forEach(input => {
      input.value = '';
      input.classList.remove('input-error');
    });
    inputs = document.querySelector(`.${listClassNames.second}`);
    inputs.remove();
    inputs = document.querySelector(`.${listClassNames.third}`);
    inputs.remove();

    const form = document.createElement('dvi');
    form.classList.add(listClassNames.third);

    const btnAdd = document.createElement('button');
    btnAdd.classList.add(listClassNames.second);
    btnAdd.type = 'button';
    btnAdd.textContent = 'Добавить контакт';

    const mainBtn = document.querySelector(`.${listClassNames.fourth}`);
    mainBtn.append(form);
    mainBtn.append(btnAdd);
  }

  
  // Sort Table
  function sortTable (id, typeSort, clientsList) {
    let sortArray = [];
    let sortedClientList = [];
    switch (id) {
      case 0:
        clientsList.forEach(client => sortArray.push(client.id));
        typeSort ? sortArray.sort() : sortArray.sort((a, b) => b - a);
        for (let i = 0; i < clientsList.length; ++i) {
          clientsList.forEach(client => {
            if (client.id === sortArray[i]) {
              sortedClientList.push(client);
            }
          });
        }
        clearTable();
        drawingTableOfClients(sortedClientList);
        break;
      case 1:
        clientsList.forEach(client => sortArray.push(client.surname + client.name + client.lastName));
        typeSort ? sortArray.sort() : sortArray.sort().reverse();
        for (let i = 0; i < clientsList.length; ++i) {
          clientsList.forEach(client => {
            if (sortArray[i].includes(client.surname) && sortArray[i].includes(client.name) && sortArray[i].includes(client.lastName)) {
              sortedClientList.push(client);
            }
          });
        }
        clearTable();
        drawingTableOfClients(sortedClientList);
        break;
      case 2:
        clientsList.forEach(client => sortArray.push(new Date(client.createdAt)));
        typeSort ? sortArray.sort((a, b) => a.getTime() - b.getTime()) : sortArray.sort((a, b) => b.getTime() - a.getTime());
        for (let i = 0; i < clientsList.length; ++i) {
          clientsList.forEach(client => {
            if (new Date(client.createdAt).getTime() === sortArray[i].getTime()) {
              sortedClientList.push(client);
            }
          });
        }
        clearTable();
        drawingTableOfClients(sortedClientList);
        break;
      case 3:
        clientsList.forEach(client => sortArray.push(new Date(client.updatedAt)));
        typeSort ? sortArray.sort((a, b) => a.getTime() - b.getTime()) : sortArray.sort((a, b) => b.getTime() - a.getTime());
        for (let i = 0; i < clientsList.length; ++i) {
          clientsList.forEach(client => {
            if (new Date(client.updatedAt).getTime() === sortArray[i].getTime()) {
              sortedClientList.push(client);
            }
          });
        }
        clearTable();
        drawingTableOfClients(sortedClientList);
        break;
      default:
        break;
    }
  }



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
    fetch(SERVER_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error, status = ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
          clientList = data;
          console.log('Client list:', clientList);
          clearTable();
          drawTable();
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
    // let tbody = document.querySelector('.main__table-tbody');
    // tbody.remove();
    // tbody = document.createElement('tbody');
    // tbody.classList.add('main__table-tbody');
    // const table = document.querySelector('.main__table');
    // table.append(tbody);
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
  

////////////////////////////////////////////////////////////////////////////////////////////////////
// Main
//
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////


  window.addEventListener('DOMContentLoaded', async () => {

    console.log('SERVER_URL: ', SERVER_URL);

    const p = document.getElementById("logMessages");

    p.replaceChildren();
    for(let i=0; i < logMessages.length; i++) {
      p.appendChild(document.createTextNode(`Error: ${logMessages[i].message}`));
    }

    setInterval(() => {
      pollData();
    }, 5000);

    // for (let i = 1; i < 5; ++i) {
    //   addActionsToModalWindow(i);
    // }

    // const clientsList = await getListOfClients(SERVER_URL);
    // setTimeout(drawingTableOfClients(clientsList), 1500);

    // addModal - модалка "Добавить клиента"
    const modalAdd = new bootstrap.Modal(document.querySelector('#addModal'));

    // button - главная кнопка "Добавить клиента"
    // const mainBtnAdd = document.querySelector('.main__btn-add');
    // mainBtnAdd.addEventListener('click', () => modalAdd.show());

    // // "закрыть модальное окно - кнопка-крест"
    // const btnClose = document.querySelector('.modal__add-btn');
    // btnClose.addEventListener('click', () => modalAdd.hide());

    // // "Отменить" - кнопка
    // const btnCancelAdd = document.querySelector('.footer__btn-cancel-add');
    // btnCancelAdd.addEventListener('click', () => {
    //   clearModal(1);
    //   addActionsToModalWindow(4);
    //   modalAdd.hide();
    // });

    // // "Сохранить" - кнопка
    // const btnSaveAdd = document.querySelector('.footer__btn-save-add');
    // btnSaveAdd.form.addEventListener('submit', async (e) => {
    //   e.preventDefault();

    //   const clientSurname = document.getElementById('input-surname-1');
    //   const clientName = document.getElementById('input-name-1');
    //   const clientLastName = document.getElementById('input-lastName-1');

    //   function removeError (input) {
    //     const parent = input.parentNode

    //     if (parent.classList.contains('input-error')) {
    //       parent.querySelector('.error-label').remove()
    //       parent.classList.remove('input-error')
    //     }
    //   }

    //   function createError (input, text) {
    //     const parent = input.parentNode
    //     const errorLabel = document.createElement('label')

    //     errorLabel.classList.add('error-label')
    //     errorLabel.textContent = text

    //     parent.classList.add('input-error')
    //     parent.append(errorLabel)
    //   }

    //   let isChecked = false;
    //   const allInputs = document.getElementsByClassName('modal__add-input');

    //   for (const input of allInputs) {
    //     removeError(input)
    //     if(input.value.trim() == '') {
    //       createError(input)
    //     }
    //   }

    //   if (clientSurname.value.trim() == '' || clientSurname.value.trim().replace(REGEXP_PERSON_NAME, '') != '') {
    //     createError(document.getElementById('input-surname-1'), 'Введите фамилию клиента')
    //     isChecked = true;
    //   }
    //   if (clientName.value.trim() == '' || clientName.value.trim().replace(REGEXP_PERSON_NAME, '') != '') {
    //     createError(document.getElementById('input-name-1'), 'Введите имя клиента')
    //     isChecked = true;
    //   }
    //   if (clientLastName.value.trim() == '' || clientLastName.value.trim().replace(REGEXP_PERSON_NAME, '') != '') {
    //     createError(document.getElementById('input-lastName-1'), 'Введите отчество клиента')
    //     isChecked = true;
    //   }
    //   if (isChecked) return;

    //   // client.contacts
    //   const listTypes = document.querySelectorAll('.filter-option-inner-inner');
    //   const listValues = document.querySelectorAll('.select__input');
    //   let contacts = [];
    //   for (let i = 0; i < listTypes.length; ++i) {
    //     if (!listValues[i].value) continue;
    //     contacts.push({
    //       type: listTypes[i].textContent,
    //       value: listValues[i].value.trim()
    //     });
    //   }

    //   await fetch(SERVER_URL, {
    //     method: 'POST',
    //     body: JSON.stringify({
    //       surname: clientSurname.value.trim(),
    //       name: clientName.value.trim(),
    //       lastName: clientLastName.value.trim(),
    //       contacts: contacts
    //     }),
    //     headers: { 'Content-Type': 'application/json' },
    //   });

    //   // Clear
    //   clearModal(1);
    //   addActionsToModalWindow(4);
    //   modalAdd.hide();

    //   // Отрисовка
    //   const clientsList = await getListOfClients(SERVER_URL);
    //   clearTable();
    //   drawingTableOfClients(clientsList);
    // });

    // // Поиск (header__input-search)
    // let timeoutID;
    // const searchInput = document.querySelector('.header__input-text');
    // searchInput.addEventListener('input', () => {
    //   const searchInputList = document.querySelector('.header__input-search');
    //   searchInputList.style.display = 'block';
    //   clearTimeout(timeoutID);
    //   timeoutID = setTimeout(async () => {
    //     const clientsListFitered = await getListOfClients(`${SERVER_URL}?search=${searchInput.value}`);
    //     if (clientsListFitered.length) {
    //       let searchInputItem = document.querySelectorAll('.input__search-item');
    //       searchInputItem.forEach(item => item.remove());
    //       if (clientsListFitered.length < clientsList.length) {
    //         clientsListFitered.forEach(client => {
    //           searchInputItem = document.createElement('li');
    //           searchInputItem.classList.add('input__search-item');
    //           searchInputItem.textContent = client.name + ' ' + client.surname;
    //           // для клика
    //           searchInputItem.addEventListener('click', () => {
    //             const tbodyTr = document.querySelectorAll('.main__tbody-tr');
    //             const tbodyTd = document.querySelectorAll('.td__fio');
    //             for (let i = 0; i < tbodyTr.length; ++i) {
    //               if (tbodyTd[i].textContent == `${client.surname} ${client.name} ${client.lastName}`) {
    //                 tbodyTr[i].style = 'border: 2px solid var(--firm)';
    //                 tbodyTr[i].addEventListener('click', () => tbodyTr[i].style = 'border: none; border-bottom: 0.5px solid var(--grey);');
    //                 searchInput.value = '';
    //                 searchInputList.remove();
    //                 const searchList = document.createElement('ul');
    //                 searchList.classList.add('header__input-search');
    //                 const headerInput = document.querySelector('.header__input');
    //                 headerInput.append(searchList);
    //                 searchInputItem = document.createElement('li');
    //                 searchInputItem.classList.add('input__search-item');
    //                 searchInputItem.textContent = 'Ничего не найдено';
    //                 searchInputItem.style = 'cursor: default';
    //                 searchList.append(searchInputItem);
    //                 break;
    //               }
    //             }
    //           });
    //           searchInputList.append(searchInputItem);
    //         });
    //         const searchInputItems = document.querySelectorAll('.input__search-item');
    //         let index = 0;
    //         document.body.addEventListener('keydown', e => {
    //           switch (e.keyCode) {
    //             case 13:
    //               const inputClientData = searchInput.value.split(' ');
    //               const tbodyTr = document.querySelectorAll('.main__tbody-tr');
    //               const tbodyTd = document.querySelectorAll('.td__fio');
    //               for (let i = 0; i < tbodyTr.length; ++i) {
    //                 if (tbodyTd[i].textContent.includes(inputClientData[0]) && tbodyTd[i].textContent.includes(inputClientData[1])) {
    //                   tbodyTr[i].style = 'border: 2px solid var(--firm)';
    //                   tbodyTr[i].addEventListener('click', () => tbodyTr[i].style = 'border: none; border-bottom: 0.5px solid var(--grey);');
    //                   searchInput.value = '';
    //                   searchInputList.remove();
    //                   const searchList = document.createElement('ul');
    //                   searchList.classList.add('header__input-search');
    //                   const headerInput = document.querySelector('.header__input');
    //                   headerInput.append(searchList);
    //                   searchInputItem = document.createElement('li');
    //                   searchInputItem.classList.add('input__search-item');
    //                   searchInputItem.textContent = 'Ничего не найдено';
    //                   searchInputItem.style = 'cursor: default';
    //                   searchList.append(searchInputItem);
    //                   break;
    //                 }
    //               }
    //               break;
    //             case 16:
    //               if (index == 1) break;
    //               --index;
    //               if (index < searchInputItems.length) {
    //                 searchInputItems[index].style = '';
    //               }
    //               searchInputItems[index -1].style = 'background-color: #f5f5f5';
    //               searchInput.value = searchInputItems[index - 1].textContent;
    //               break;
    //             case 17:
    //               if (index == searchInputItems.length) break;
    //               if (index) {
    //                 searchInputItems[index - 1].style = '';
    //               }
    //               searchInputItems[index].style = 'background-color: #f5f5f5';
    //               searchInput.value = searchInputItems[index].textContent;
    //               break;
    //             default:
    //               break;
    //           }
    //         });
    //       } else {
    //         searchInputItem = document.createElement('li');
    //         searchInputItem.classList.add('input__search-item', 'not-found');
    //         searchInputItem.textContent = 'Ничего не найдено';
    //         searchList.append(searchInputItem);
    //       }
    //     }
    //   }, 300)
    // })

    // searchInput.addEventListener('blur', () => {
    //   const searchInputList = document.querySelector('.header__input-search');
    //   if (searchInputList) {
    //     document.body.addEventListener('click', e => {
    //       if (e.target.nodeName != 'LI') {
    //         searchInputList.style.display = 'none';
    //       }
    //     });
    //   }
    // });

    // // События сортировки
    // const theadTd = document.querySelectorAll('.table__thead-td span');
    // let typeSort = [true, false, false, false];
    // for (let i = 0; i < 4; ++i) {
    //   theadTd[i].addEventListener('click', async () => {
    //     const classNames = [{first: 'active-up', second: 'active-up-fio'},
    //                         {first: 'active-down', second: 'active-down-fio'}];
    //     for (let j = 0; j < 4; ++j) {
    //       if (j === 1) {
    //         if (theadTd[j].classList.contains(classNames[0].second)) {
    //           theadTd[j].classList.remove(classNames[0].second);
    //         }
    //         if (theadTd[j].classList.contains(classNames[1].second)) {
    //           theadTd[j].classList.remove(classNames[1].second);
    //         }
    //       } else {
    //         if (theadTd[j].classList.contains(classNames[0].first)) {
    //           theadTd[j].classList.remove(classNames[0].first);
    //         }
    //         if (theadTd[j].classList.contains(classNames[1].first)) {
    //           theadTd[j].classList.remove(classNames[1].first);
    //         }
    //       }
    //     }
    //     if (i === 1) {
    //       if (typeSort[i]) {
    //         theadTd[i].classList.add(classNames[1].second);
    //         typeSort[i] = false;
    //       } else {
    //         theadTd[i].classList.add(classNames[0].second);
    //         typeSort[i] = true;
    //       }
    //     } else {
    //       if (typeSort[i]) {
    //         theadTd[i].classList.add(classNames[1].first);
    //         typeSort[i] = false;
    //       } else {
    //         theadTd[i].classList.add(classNames[0].first);
    //         typeSort[i] = true;
    //       }
    //     }
    //     const clientsList = await getListOfClients(SERVER_URL);
    //     sortTable(i, typeSort[i], clientsList);
    //   })
    // }

  });
})();
