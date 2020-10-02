const { Log } = require('../models/log.js');

exports.get = (req, res) => {
  res.render('log', { data: req.user.ownDrinks });
};

exports.post = async(req, res) => {
  const existingLog = req.user.log;
  const data = req.body;

  try {
    if (data.date === '') throw new Error('Please choose a date');

    let keys = Object.keys(req.body);
    let IDs = keys.slice(1);
    const drinks = createDrinkArr(IDs, data);
    const log = { date: data.date, drinks };

    const idx = existingLog.findIndex(entry => {
      return entry.date.toISOString().slice(0, 10) === log.date;
    });

    if (idx !== -1) {
      const existingDrinks = existingLog[idx].drinks;

      for (let i = 0; i < drinks.length; i++) {
        const drinkIdx = existingDrinks.findIndex(drink => drink.drinkId.toString() === drinks[i].drinkId.toString());
        drinkIdx === -1 ?
          existingDrinks.push(drinks[i]) :
          existingDrinks[drinkIdx].quantity += +drinks[i].quantity;
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

const createDrinkArr = (IDs, data) => {
  let drinks = [];

  for (let i = 0; i < IDs.length; i++) {
    const drinkId = IDs[i];
    if (data[drinkId] > 0) {
      drinks.push({
        drinkId,
        quantity: data[drinkId],
      });
    }
  }

  return drinks;
};