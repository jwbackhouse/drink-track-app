const { Drink } = require('../models/drinks.js');

// NB Mongoose provides easy ways to deal with query string if using populate
// (see Udemy course)
exports.all_get = async(req, res) => {
  try {
    let drinks = req.user.ownDrinks || [];

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

    res.render('drinks', { title: 'Drinks', data: drinks });
  } catch (err) {
    res.render('drinks', { title: 'Drinks', error: err });
  }
};

exports.create_get = (req, res) => {
  res.render('drink_form', { title: 'Add a drink', id: 'add-drink' });
};

exports.create_post = async(req, res) => {
  try {
    const newDrink = new Drink(req.body);

    if (newDrink.name === '') throw new Error('Please add a name');
    // TODO: Check for duplicates

    req.user.ownDrinks.push(newDrink);
    await req.user.save();
    res.send();
    // res.redirect('/drinks');
  } catch (err) {
    res.render('drink_form', { error: err.message });
  }
};

exports.drink_get = async(req, res) => {
  const drinkId = req.params.id;
  const drinks = req.user.ownDrinks;

  try {
    const drink = drinks.id(drinkId); // Mongoose method for finding subdoc by id

    drink ?
      res.render('drink_form', {
        title: 'Edit details',
        drink,
        id: 'update-drink',
        buttonCopy: 'Save',
      }) :
      res.render('drinks', { error: 'Drink not found' });
  } catch (err) {
    res.render('drinks', { error: err.message });
  }
};

exports.drink_put = async(req, res) => {
  const drinkId = req.params.id;
  const drinks = req.user.ownDrinks;
  const updates = req.body;

  try {
    // Check drink exists
    const currentDrink = drinks.id(drinkId);
    if (!currentDrink) return res.status(404).send({ error: 'Drink not found' });

    // Check key can be updated
    const updateFields = Object.keys(updates);
    const allowedUpdates = ['name', 'description', 'category', 'abv', 'size', 'price'];
    const isValidUpdate = updateFields.every(update => allowedUpdates.includes(update));
    if (!isValidUpdate) {
      console.log('invalid');
      return res.status(400).send({ error: 'Invalid operation.' });
    }

    updateFields.forEach(field => currentDrink[field] = updates[field]);
    await req.user.save(); // NB have to save parent, not the subdoc
    res.send();
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

exports.drink_delete = async(req, res) => {
  const drinkId = req.params.id;
  const drinks = req.user.ownDrinks;

  // Check user owns the drink
  try {
    const idx = drinks.findIndex(drink => drink._id.toString() === drinkId);
    if (idx === -1) return res.status(404).send({ error: 'Drink not found.' });

    drinks.splice(idx, 1);
    await req.user.save();
    res.render('drinks', { title: 'Drinks', data: drinks });
  }
  catch (error) {
    res.render('drinks', { error });
  }
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
