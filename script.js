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
        console.log("Signup")
    }

    function homeHandler () {
        const eventForm = document.querySelector('#add-new-event');
        const urlEvent = 'http://127.0.0.1:5000/create_event';
        eventForm.addEventListener('submit', (event) => {
                event.preventDefault();
                sendRequestToServer(event.target, urlEvent)
                .then(data =>  console.log(data))
        })

        const today = new Date().toISOString();
        getEventsByDate(today)
        .then(data => console.log(data))
    }

    function sendRequestToServer(form, url) {

      const formData = new FormData(form);
      const data = {};

      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }

      return new Promise((resolve, reject) => {
          fetch(url, {
              method: "POST",
              headers: { "Content-type": "application/json" },
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
        console.log(token)
        const apiUrl = `http://127.0.0.1:5000/get_events_by/${date}`;

        return fetch(apiUrl, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`
            }})
          .then(response => response.json())
          .catch(error => {
            console.error('Error:', error);
          });
        }

}