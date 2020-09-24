const { ObjectID, MongoClient } = require('mongodb');

// Configure MongoDB connection
const uri = "mongodb+srv://learning:J8M0ng0d!@task-manager.flgin.gcp.mongodb.net/task-manager?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

// NB all calls to db happen within this connection function
client.connect(err => {
  err ? console.log(err) : console.log('Connected to the db.');

  // NB collections auto-created when new name is specified
  const users = client.db("task-manager").collection("users");
  const tasks = client.db("task-manager").collection("tasks");

  // users.insertOne({
  //   name: 'James Backhouse',
  //   age: 38,
  // })
  //   .then(result => console.log('Insertion operation was a success.'))
  //   .catch(err => console.error(err));

  // tasks.insertMany([
  //   {
  //     description: 'Propagate geraniums',
  //     complete: false,
  //   },{
  //     description: 'Train Bear on recall',
  //     complete: false,
  //   },{
  //     description: 'Sow seeds',
  //     complete: false,
  //   }
  // ])
  //   .then(result => console.log('Insertion operation was a success.'))
  //   .catch(err => console.error(err));

  // users.find({ name: 'James Backhouse'}).toArray((err, result) => {
  //   console.log(result); // Returns found documents
  // });

  // tasks.updateMany({ complete: false }, {
  //   $set: {
  //     complete: true,
  //   }
  // })
  //   .then(result => console.log(result.modifiedCount + ' documents updated.'))
  //   .catch(err => console.error(err));

  tasks.deleteMany({
    "description": { $not: {$eq: 'Propagate geraniums'} }
  })
    .then(result => console.log(result.deletedCount))
    .catch(err => console.error(err));

  client.close();
});
