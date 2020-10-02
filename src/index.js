const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
require('./db/mongoose.js');

const drinkRouter = require('./routers/drinks.js');
const userRouter = require('./routers/users.js');
const logRouter = require('./routers/log.js');
const authRouter = require('./routers/auth.js');

const publicPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');

const app = express();
const port = process.env.PORT || 8080;

// Configure express
app.set('view engine', 'pug');
app.set('views', viewsPath);
app.use(express.static(publicPath));
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json()); // Configure express to auto-parse JSON
app.use(cookieParser());
app.use(userRouter);
app.use(drinkRouter);
app.use(logRouter);
app.use(authRouter);  // Must come last - contains 404 route

app.listen(port, () => {
  console.log('App is running on port ' + port);
});
