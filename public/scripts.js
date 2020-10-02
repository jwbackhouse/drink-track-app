console.log('Client side scripts.js is running.');

// Handle drink deletion
const deleteButtons = document.querySelectorAll('.delete-btn');
if (deleteButtons.length > 0) {
  deleteButtons.forEach(button => {
    button.addEventListener('click', async(e) => {
      const id = e.target.id;
      const url = window.location.href + '/' + id;

      fetch(url, {
        method: 'DELETE',
        credentials: 'same-origin',
      })
        // .then(() => console.log('deleted' + e.target.name))
        // .catch(err => alert('Something went wrong:' + err.message));
    });
  });
}

// Handle PUT request for updating drinks
const updateDrinkForm = document.getElementById('update-drink');
if (updateDrinkForm) {
  updateDrinkForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const data = new URLSearchParams (new FormData(updateDrinkForm));

    const url = window.location.href;
    await fetch(url, {
        method: 'PUT',
        credentials: 'same-origin',
        body: data,
      })
      .then(() => window.location.href='/drinks')
      .catch(err => alert('Something went wrong:' + err.message));
  });
}

// Handle POST request for adding drink
const addDrinkForm = document.getElementById('add-drink');
if (addDrinkForm) {
  addDrinkForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const data = new URLSearchParams (new FormData(addDrinkForm));

    const url = window.location.href;
    await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        body: data,
      })
      .then(() => window.location.href='/drinks')
      .catch(err => alert('Something went wrong:' + err.message));
  });
}
