const express = require('express');
const path = require('path');
// const pug = require('pug');
require('./db/mongoose.js');
const drinkRouter = require('./routers/drinks-router.js');
const userRouter = require('./routers/users-router.js');

const publicPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
// const partialsPath = path.join(__dirname, '../templates/partials');

const app = express();
const port = process.env.PORT || 8080;

// Configure express
app.set('view engine', 'pug');
app.set('views', viewsPath);
// hbs.registerPartials = partialsPath;
app.use(express.static(publicPath));
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json()); // Configure express to auto-parse JSON
app.use(userRouter);
app.use(drinkRouter);

app.listen(port, () => {
  console.log('App is running on port ' + port);
});
