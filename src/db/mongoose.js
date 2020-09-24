const mongoose = require('mongoose');
const User = require('../models/users.js');
const Drink = require('../models/drinks.js');

// Establish connection
const cnxURL = 'mongodb+srv://learning:J8M0ng0d!@task-manager.flgin.gcp.mongodb.net/task-manager?retryWrites=true&w=majority';
mongoose.connect(cnxURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});




// const casper = new User({
//   name: 'Caspertronic Backhouse   ',
//   email: 'casper@redcot.com',
// });

// casper.save()
//   .then(casper => console.log('Added successfullly'))
//   .catch(err => console.log(err));



// const wine250 = new Drink({
//   name: 'Wine',
//   description: '250ml glass',
//   abv: 0.13,
//   size: 0.25,
// });

// wine250.save()
//   .then(wine250 => console.log(wine250))
  // .catch(err => console.log(err));

// Drink.deleteOne({
//   name: 'Wine',
// }, err => {
//   if (err) console.log(err);
// });
