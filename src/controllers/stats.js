exports.get = (req, res) => {
  const today = new Date().setHours(0, 0, 0, 0); // Set to midnight to match log date
  const data = {
    l7d: getDailyData(today, req.user.log, req.user.ownDrinks),
    l4w: getWeeklyData(today, req.user.log, req.user.ownDrinks),
  };
  res.render('stats', { data });
};

const getDailyData = (today, log, userDrinks) => {
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

    // Look for existing log (NB have to coerce to numbers)
    const daysLog = l7dRecords.find(record => +record.date === +refDate);

    if (daysLog) {
      daysLog.drinks.forEach(drink => {
        result.daily[i].quantity += drink.quantity;
        result.total.quantity += drink.quantity;

        for (let d of userDrinks) {
          if (d.id === drink.drinkId.toString()) {
            result.daily[i].units += Math.round(d.units * drink.quantity);
            result.total.units += Math.round(d.units * drink.quantity);

            result.daily[i].spend += Math.round(d.price * drink.quantity);
            result.total.spend += Math.round(d.price * drink.quantity);
            break;
          }
        }
      });
    }
  }
  return result;
};

const getWeeklyData = (today, log, userDrinks) => {
  const weekInMS = (1000 * 60 * 60 * 24 * 7);
  const startPoint = today - (weekInMS * 4);
  const result = {
    weekly: {},
  };

  const l4wRecords = log.filter(record => record.date.getTime() >= startPoint);

  for (let i = 1; i <= 4; i++) {
    const refDate = new Date(today - (weekInMS * i));

    result.weekly[i] = {
      week: refDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      quantity: 0,
      units: 0,
      spend: 0,
    };

    // Look for existing logs
    const weeksLog = l4wRecords.find(record => {
      return (+record.date >= +refDate && +record.date < (+refDate + weekInMS));
    });

    if (weeksLog) {
      weeksLog.drinks.forEach(drink => {
        result.weekly[i].quantity += drink.quantity;

        for (let d of userDrinks) {
          if (d.id === drink.drinkId.toString()) {
            result.weekly[i].units += Math.round(d.units * drink.quantity);
            result.weekly[i].spend += Math.round(d.price * drink.quantity);
            break;
          }
        }
      });
    }
  }
  return result;
};
