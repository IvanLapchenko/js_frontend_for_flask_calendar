window.onload = (event) => {
    const form = document.getElementById('add-new-event');

    form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:5000/create_event', true);

    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            console.log('Data successfully sent');
        }
    }
    xhr.send(formData);
    });
}



const today_date = new Date();
const year = today_date.getFullYear();
const month = String(today_date.getMonth() + 1).padStart(2, '0');
const day = String(today_date.getDate()).padStart(2, '0');
const today = `${year}-${month}-${day}`;


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

