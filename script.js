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
        console.log('a')
        loginForm.addEventListener('submit', (event) => {
                event.preventDefault();
                console.log(event.target);
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
        console.log("Home")
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


//    const today = new Date().toISOString();
//
//    const apiUrl = `http://127.0.0.1:5000/get_events_by/${today}`;
//
//    fetch(apiUrl)
//      .then(response => response.json())
//      .then(data => {
//        console.log(data);
//      })
//      .catch(error => {
//        console.error('Error:', error);
//      });

}