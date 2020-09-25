const mongoose = require('mongoose');

// Establish connection
const cnxURL = 'mongodb+srv://learning:J8M0ng0d!@task-manager.flgin.gcp.mongodb.net/task-manager?retryWrites=true&w=majority';
mongoose.connect(cnxURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// Bind MongoDB errors to console
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
