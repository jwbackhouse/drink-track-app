const { Drink } = require('../models/drinks.js');

exports.post = async(req, res) => {
  try {
    const newDrink = new Drink(req.body);
    req.user.ownDrinks.push(newDrink);
    await req.user.save();

    res.status(201).send(newDrink);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// NB Mongoose provides easy ways to deal with query string if using populate
// (see Udemy course)
exports.all_get = async(req, res) => {
  try {
    let drinks = req.user.ownDrinks;

    const category = req.query.cat;
    const sortBy = req.query.sortBy;
    const order = req.query.order;

    // GET /drinks?cat=beer&cat=wine
    if (category) {
      drinks = drinks.reduce((init, drink) => {
        category.forEach(cat => {
          if (drink.category === cat) init.push(drink);
        });
        return init;
      }, []);
    }

    // GET /drinks?sortBy=<category || size || abv>&order=<(empty) || desc>
    if (sortBy) {
      drinks = drinks.sort((a, b) => {
        switch (sortBy) {
          case 'category':
            return a.category < b.category ? -1 : 1;
          case 'size':
            return a.size < b.size ? -1 : 1;
          case 'abv':
            return a.abv < b.abv ? -1 : 1;
          default:
            return 0;
        }
      });

      if (order === 'desc') drinks.reverse();
    }

    // res.send(drinks);
    res.render('drinks', { title: 'Drinks', data: drinks });
  } catch (err) {
    // res.status(500).send({ error: err.message });
    res.render('drinks', { title: 'Drinks', error: err });
  }
};

exports.get = async(req, res) => {
  const drinkId = req.params.id;
  const drinks = req.user.ownDrinks;

  try {
    const drink = drinks.id(drinkId); // Mongoose method for finding subdoc by id

    drink ?
      res.send(drink) :
      res.status(404).send({ error: 'Drink not found' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.patch = async(req, res) => {
  const drinkId = req.params.id;
  const drinks = req.user.ownDrinks;

  try {
    // Check key can be updated
    const updateFields = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'abv', 'size', 'price'];
    const isValidUpdate = updateFields.every(update => allowedUpdates.includes(update));
    if (!isValidUpdate) return res.status(400).send({ error: 'Invalid operation.' });

    const drink = drinks.id(drinkId);
    if (!drink) return res.status(404).send({ error: 'Drink not found' });

    for (let field in req.body) {
      drink[field] = req.body[field];
    }

    await req.user.save(); // NB have to save parent, not the subdoc
    res.send(drink);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.delete = async(req, res) => {
  const drinkId = (req.params.id);
  const drinks = req.user.ownDrinks;

  // Check user owns the drink
  const idx = drinks.findIndex(drink => drink._id.toString() === drinkId);
  if (idx === -1) return res.status(404).send({ error: 'Drink not found.' });

  const deleted = drinks.splice(idx, 1);
  res.send(deleted);
};


// FOR DEV PURPOSES ONLY
exports.all_delete = async(req, res) => {
  try {
    await Drink.deleteMany({});
    res.send();
  } catch (err) {
    res.status(500).send();
  }
};
