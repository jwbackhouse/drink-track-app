exports.get = (req, res) => {
  const today = new Date().setHours(0, 0, 0, 0); // Set to midnight to match log date
  const data = getData(today, req.user.log);
  res.render('stats', { data });
};

const getData = (today, log) => {
  const dayInMS = (1000 * 60 * 60 * 24);
  const startPoint = today - (dayInMS * 7);
  const result = {
    total: { quantity: 0 },
    daily: {},
  };

  const l7dRecords = log.filter(record => record.date.getTime() >= startPoint);

  for (let i = 1; i <= 7; i++) {
    const refDate = today - (dayInMS * i);

    result.daily[i] = {
      day: refDate,
      quantity: 0
    };

    const daysLog = l7dRecords.find(record => {
      const recordDate = record.date.getTime();
      return recordDate === refDate;
    });

    if (daysLog) {
      daysLog.drinks.forEach(drink => {
        result.daily[i].quantity += drink.quantity;
        result.total.quantity += drink.quantity;
      });
    }
  }

  console.log(result);
  // return {
  //   last7Days: {
  //     total: {
  //       units: ,
  //       mix: ,
  //       spend: ,
  //     },
  //     daily: {
  //       day1: {
  //         day: ,
  //         units: ,
  //         mix: ,
  //         spend: ,
  //       },
  //     }
  //   }
}
