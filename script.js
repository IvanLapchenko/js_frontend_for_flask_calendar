window.onload = (event) => {

    const routes = [
      { path: '/', handler: homeHandler },
      { path: '/login.html', handler: loginHandler },
      { path: '/signup.html', handler: signupHandler },
      { path: '/index.html', handler: homeHandler },
    ];

    handleRoutes()



    function loginHandler () {
        const loginForm = document.querySelector('#login-form');
        const urlLogin = 'http://127.0.0.1:5000/login';

        loginForm.addEventListener('submit', (event) => {
                event.preventDefault();
                sendRequestToServer(event.target, urlLogin)
                .then(data => {
                    localStorage.setItem('token', data.token);
                    if ( data.isLogged ) {
                                location.replace('/index.html')
                    };
                })
        })
    }

    function signupHandler () {
        const loginForm = document.querySelector('#signup-form');
        const urlLogin = 'http://127.0.0.1:5000/signup';

        loginForm.addEventListener('submit', (event) => {
                event.preventDefault();
                sendRequestToServer(event.target, urlLogin)
                .then(data => {
                    if ( data.isAddedToDB ) {
                                location.replace('/login.html')
                    };
        })
    })}

    function homeHandler () {
        const logoutButton = document.querySelector('#logout');
        const eventForm = document.querySelector('#add-new-event');
        const urlEvent = 'http://127.0.0.1:5000/create_event';

        renderEventsForFiveDays();


        eventForm.addEventListener('submit', (event) => {
                event.preventDefault();
                sendRequestToServer(event.target, urlEvent)
                .then(data =>  console.log(data))


        })

        logoutButton.addEventListener('click', (event) => {
            logout();
        })
    }

    function convertStringToDate(str) {
        return new Date(str).toLocaleDateString();
    }

    function logout () {
        localStorage.removeItem('token');
        location.replace('/login.html');
    }


    function sendRequestToServer(form, url) {
      const formData = new FormData(form);
      const data = {};
      const token = localStorage.getItem('token');
      let headersData = { "Content-type": "application/json" };

      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
      if (token)
        headersData.Authorization = `Bearer ${token}`;


      return new Promise((resolve, reject) => {

          fetch(url, {
              method: "POST",
              headers: headersData,
              body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then((data) => { resolve(data) })
            .catch((error) => {
              console.error("Помилка:", error);
              reject(error);
            });
      });
    }


    function handleRoutes () {
        const currentPath = window.location.pathname;
        const routeData = routes.find(route => route.path === currentPath);
        if (routeData) {
            routeData.handler();
           }
        else { homeHandler() }
    }


    function getEventsByDate (date) {
        const token = localStorage.getItem('token');
        const apiUrl = `http://127.0.0.1:5000/get_events_by/${date}`;

        return fetch(apiUrl, {
            method: "GET",
                headers: { Authorization: `Bearer ${token}`}
          })
          .then(response => response.json())
          .catch(error => {
            console.error('Error:', error);
          });
    }


function createHeader(headerText) {
  const header = document.createElement('h3');
  header.textContent = headerText;
  header.role = 'button';
  return header;
}

function createTime(timeText) {
  const time = document.createElement('span');
  if (timeText !== undefined) {
    time.textContent = timeText;
  }
  return time;
}

function createDescription(descriptionValue) {
  const describe = document.createElement('p');
  describe.value = descriptionValue;
  describe.style.display = 'none';
  return describe;
}

function createDeleteButton(headerText) {
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.value = headerText;
  deleteButton.addEventListener('click', () => sendDeleteRequest(deleteButton.value));
  return deleteButton;
}

function createEventDiv(event) {
  const header = createHeader(event.header);
  const time = createTime(event.time);
  const describe = createDescription(event.describe);
  const deleteButton = createDeleteButton(event.header);

  header.addEventListener('click', function() {
    describe.style.display = describe.style.display === 'none' ? 'block' : 'none';
  });

  const eventDiv = document.createElement('div');
  eventDiv.classList.add('single-event');
  eventDiv.appendChild(deleteButton);
  eventDiv.appendChild(header);
  eventDiv.appendChild(time);
  eventDiv.appendChild(describe);

  return eventDiv;
}

function showEvents(eventsFromAPI, date) {
  const eventsDiv = document.getElementById('events-for-five-days');
  const dayEventsDiv = document.createElement('div');
  dayEventsDiv.classList.add('single-day');

  const displayData = document.createElement('h2');
  displayData.textContent = date;
  dayEventsDiv.appendChild(displayData);

  eventsFromAPI.forEach(function(event) {
    event = JSON.parse(event);
    const eventDiv = createEventDiv(event);
    dayEventsDiv.appendChild(eventDiv);
  });

  eventsDiv.appendChild(dayEventsDiv);
}

function sendDeleteRequest (eventData) {
    const token = localStorage.getItem('token');
    const deleteUrl = `http://127.0.0.1:5000/delete_event_by/${eventData}`;
    fetch(deleteUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`}
        })
    .then(response => console.log(response));
}

function renderEventsForFiveDays () {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 5);
    let currentDate = new Date();

    while (currentDate <= endDate) {
        console.log(currentDate)
        date = currentDate.toISOString();
        let dateToDisplay = convertStringToDate(currentDate);

        getEventsByDate(date)
        .then(data => showEvents(data, dateToDisplay))
        currentDate.setDate(currentDate.getDate() + 1);
        }
    }

}
