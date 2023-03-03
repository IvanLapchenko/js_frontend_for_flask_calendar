window.onload = (event) => {

    const routes = [
      { path: '/', handler: homeHandler },
      { path: '/login', handler: loginHandler },
      { path: '/register', handler: registerHandler },
      { path: '/home', handler: homeHandler },
    ];


    const form = document.querySelector('#add-new-event');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const data = {};

      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }

      fetch('http://127.0.0.1:5000/create_event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(data => console.log(data))
        .catch(error => console.error(error));
    });




    const today = new Date().toISOString();

    const apiUrl = `http://127.0.0.1:5000/get_events_by/${today}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

}