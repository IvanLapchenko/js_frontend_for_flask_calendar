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
                    console.log(data);
                })
        })
    }

    function signupHandler () {
        const loginForm = document.querySelector('#signup-form');
        const urlLogin = 'http://127.0.0.1:5000/signup';

        loginForm.addEventListener('submit', (event) => {
                event.preventDefault();
                sendRequestToServer(event.target, urlLogin)
                .then(data => console.log(data))
        })
    }

    function homeHandler () {
        const logoutButton = document.querySelector('#logout');
        const eventForm = document.querySelector('#add-new-event');
        const urlEvent = 'http://127.0.0.1:5000/create_event';
        const today = new Date().toISOString();

        getEventsByDate(today)
        .then(data => console.log(data))


        eventForm.addEventListener('submit', (event) => {
                event.preventDefault();
                sendRequestToServer(event.target, urlEvent)
                .then(data =>  console.log(data))
        })

        logoutButton.addEventListener('click', (event) => {
            logout();
        })
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

}