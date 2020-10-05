const { Log } = require('../models/log.js');

exports.get = (req, res) => {
  res.render('log', {
    userDrinks: req.user.ownDrinks,
    log: req.user.log,
  });
};

exports.post = async(req, res) => {
  const existingLog = req.user.log;
  const data = req.body;
  console.log('post running')

  try {
    if (data.date === '') throw new Error('Please choose a date');

    let keys = Object.keys(req.body);
    let IDs = keys.slice(1);
    const loggedDrinks = createDrinkArr(IDs, data);
    console.log(loggedDrinks)
    const log = { date: data.date, drinks: loggedDrinks };

    const matchIdx = existingLog.findIndex(entry => {
      return entry.date.toISOString().slice(0, 10) === log.date;
    });

    if (matchIdx !== -1) {
      const existingDrinks = existingLog[matchIdx].drinks;

      for (let i = 0; i < loggedDrinks.length; i++) {
        const drinkIdx = existingDrinks.findIndex(drink => {
          return drink.drinkId.toString() === loggedDrinks[i].drinkId.toString();
        });
        console.log('loggedDrinks' + i + '--' + loggedDrinks[i].quantity);
        drinkIdx === -1 ?
          existingDrinks.push(loggedDrinks[i]) :
          existingDrinks[drinkIdx].quantity = +loggedDrinks[i].quantity;
      }
    } else {
      const newLog = new Log(log);
      req.user.log.push(newLog);
    }

    await req.user.save();
    res.send();
  } catch (err) {
    console.log(err.message);
    res.render('log', { data, error: err.message });
  }
};

exports.date_get = (req, res) => {
  const date = req.params.date;
  const logs = req.user.log;
  const result = logs.find(log => {
    return log.date.toISOString().slice(0, 10) == date;
  });

  result ?
    res.send(result.drinks) :
    res.send([{}]);
};

// Helper functions
const createDrinkArr = (IDs, data) => {
  let drinkArr = [];

  for (let i = 0; i < IDs.length; i++) {
    const drinkId = IDs[i];
    const quantity = data[drinkId] === '' ? 0 : +data[drinkId];
    drinkArr.push({
      drinkId,
      quantity,
    });
  }

  return drinkArr;
};