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
        .then(() => window.location.reload())
        .catch(err => alert('Something went wrong:' + err.message));
    });
  });
}

// Handle PUT request for updating drinks
const updateDrinkForm = document.getElementById('update-drink');
if (updateDrinkForm) {
  updateDrinkForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    const data = new URLSearchParams(new FormData(updateDrinkForm));

    const url = window.location.href;
    await fetch(url, {
        method: 'PUT',
        credentials: 'same-origin',
        body: data,
      })
      .then(() => window.location.href = '/drinks')
      .catch(err => alert('Something went wrong:' + err.message));
  });
}

// Handle POST request for adding drink
const addDrinkForm = document.getElementById('add-drink');
if (addDrinkForm) {
  addDrinkForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    const data = new URLSearchParams(new FormData(addDrinkForm));

    const url = window.location.href;
    await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        body: data,
      })
      .then(() => window.location.href = '/drinks')
      .catch(err => alert('Something went wrong:' + err.message));
  });
}

// Handle date picker
const logForm = document.getElementById('log-form');
if (logForm) {
  const datePicker = logForm.querySelector('#date');
  const nextDayBtn = logForm.querySelector('#next-day');
  const prevDayBtn = logForm.querySelector('#prev-day');

  nextDayBtn.addEventListener('click', (e) => {
    e.preventDefault();
    datePicker.stepUp();
    triggerChange(datePicker);
  });

  prevDayBtn.addEventListener('click', (e) => {
    e.preventDefault();
    datePicker.stepDown();
    triggerChange(datePicker);
  });

  datePicker.addEventListener('change', async(e) => {
    try {
      const date = e.target.value;
      const url = `${window.location.href}/${date}`;

      const response = await fetch(url, {
        credentials: 'same-origin',
      });
      if (!response.ok) {
        updateInputs(undefined, false);
      } else {
        const data = await response.json();
        updateInputs(data, true);
      }

    } catch (err) {
      console.log(err.message);
    }
  });

  logForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    try {
      const data = new URLSearchParams(new FormData(logForm));

      const url = window.location.href;
      await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        body: data,
      });
    } catch (err) {
      alert('Something went wrong:' + err.message);
    }
  });
}

// Trigger change event on stepUp/stepDown
const triggerChange = (target) => {
  const event = new Event('change');
  target.dispatchEvent(event);
};

const updateInputs = (array, hasData) => {
  const allInputEls = logForm.querySelectorAll('.drink');
  if (!hasData) {
    allInputEls.forEach(input => input.value = 0);
    return;
  }
  for (let input of allInputEls) {
    for (let drink of array) {
      if (drink.drinkId === input.id.slice(2)) {
        input.value = drink.quantity;
        break;
      }
      input.value = 0;
    }
  }
};
