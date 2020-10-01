console.log('Client side scripts.js is running.');

const updateDrinkForm = document.getElementById('update-drink');

updateDrinkForm.addEventListener('submit', async(e) => {
  e.preventDefault();

  const data = new URLSearchParams (new FormData(updateDrinkForm));

  const url = window.location.href;
  await fetch(url, {
      method: 'PUT',
      credentials: 'same-origin',
      body: data,
    })
    .then(window.location.href='/drinks');
});
