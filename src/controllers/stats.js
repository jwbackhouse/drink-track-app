exports.get = (req, res) => {
  const today = new Date().setHours(0, 0, 0, 0); // Set to midnight to match log date
  const data = getData(today, req.user.log, req.user.ownDrinks);
  res.render('stats', { data });
};

const getData = (today, log, userDrinks) => {
  const dayInMS = (1000 * 60 * 60 * 24);
  const startPoint = today - (dayInMS * 7);
  const result = {
    total: { quantity: 0, units: 0, spend: 0 },
    daily: {},
  };

  const l7dRecords = log.filter(record => record.date.getTime() >= startPoint);

  for (let i = 0; i < 7; i++) {
    const refDate = new Date(today - (dayInMS * i));

    result.daily[i] = {
      day: refDate.toLocaleDateString('en-uk', { weekday: 'long' }),
      quantity: 0,
      units: 0,
      spend: 0,
    };

    const daysLog = l7dRecords.find(record => {
      const recordDate = record.date;
      return +recordDate === +refDate;  // NB have to coerce to numbers
    });

    if (daysLog) {
      daysLog.drinks.forEach(drink => {
        result.daily[i].quantity += drink.quantity;
        result.total.quantity += drink.quantity;

        for (let d of userDrinks) {
          if (d.id === drink.drinkId.toString()) {
            result.daily[i].units += (d.units * drink.quantity);
            result.total.units += (d.units * drink.quantity);

            result.daily[i].spend += (d.price * drink.quantity);
            result.total.spend += (d.price * drink.quantity);
            break;
          }
        }
      });
    }
  }
  return result;
};
