console.log('Client side scripts.js is running.');

const addDrinkForm = document.querySelector('form');

// window.addEventListener("load", function() {
//   function sendData() {
//     const XHR = new XMLHttpRequest();

//     // Bind the FormData object and the form element
//     const FD = {name: 'whisky'};

//     // Define what happens on successful data submission
//     XHR.addEventListener("load", function(event) {
//       alert(event.target.responseText);
//     });

//     // Define what happens in case of error
//     XHR.addEventListener("error", function(event) {
//       alert('Oops! Something went wrong.');
//     });

//     // Set up our request
//     XHR.open("PATCH", window.location.href);

//     // The data sent is what the user provided in the form
//     XHR.send(FD);
//   }

//   // Access the form element...
//   const form = document.getElementById("add-drink");

//   // ...and take over its submit event.
//   form.addEventListener("submit", function(event) {
//     event.preventDefault();

//     sendData();
//   });
// });


addDrinkForm.addEventListener('submit', async(e) => {
  e.preventDefault();

  const data = new URLSearchParams (new FormData(addDrinkForm));

  const url = window.location.href;
  await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      body: data,
    })
    .then(window.location.href='/drinks');
});
