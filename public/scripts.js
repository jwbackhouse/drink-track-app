console.log('Client side scripts.js is running.');

// Handle drink deletion
const deleteButtons = document.querySelectorAll('.delete-btn');
if (deleteButtons.length > 0) {
  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const id = e.target.id;
      const url = window.location.href + '/' + id;

      fetch(url, {
          method: 'DELETE',
          credentials: 'same-origin',
        })
        .then(() => window.location.reload())
        .catch(err => alert('Something went wrong: ' + err.message));
    });
  });
}

// Handle log form
const logForm = document.getElementById('log-form');
if (logForm) {
  const datePicker = logForm.querySelector('#date');
  const nextDayBtn = logForm.querySelector('#next-day');
  const prevDayBtn = logForm.querySelector('#prev-day');
  const checkbox = logForm.querySelector('#checkbox');
  const inputFields = logForm.querySelectorAll('.drink');

  nextDayBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleDateStep('up');
  });

  prevDayBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleDateStep('down');
  });

  datePicker.addEventListener('change', async (e) => {
    try {
      const date = e.target.value;
      const url = `${window.location.href}/${date}`;

      checkbox.checked = false;

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

  checkbox.addEventListener('change', (e) => {
    if (checkbox.checked) {
      for (let input of inputFields) {
        input.value = 0;
      }
    }
  });

  // Helper functions
  const handleDateStep = (direction) => {
    direction === 'up' ? datePicker.stepUp() : datePicker.stepDown();
    triggerChange(datePicker);
  };

  const triggerChange = (target) => {
    const event = new Event('change');
    target.dispatchEvent(event);
  };

  const updateInputs = (array, hasData) => {
    if (!hasData) {
      inputFields.forEach(input => input.value = '');
      return;
    }
    for (let input of inputFields) {
      for (let drink of array) {
        if (drink.drinkId === input.id.slice(2)) {
          input.value = drink.quantity;
          break;
        }
        input.value = '';
      }
    }
  };
}


// Handle logout click
const logoutLink = document.getElementById('logout');
if (logoutLink) {
  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();

    try {
      const check = window.confirm('Are you sure?');
      if (check) {
        const url = `${window.location.origin}/users/logout`;
        fetch(url, {
          credentials: 'same-origin',
          method: 'POST',
        })
          .then((res) => {
            if (res.ok) window.location.href='/';
          })
          .catch((err) => alert('Something went wrong: ' + err.message));
      }
    } catch(err) {
      console.log(err.message);
    }
  });
}
