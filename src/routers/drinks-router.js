const express = require('express');
const { Drink } = require('../models/drinks.js');
const auth = require('../middleware/auth.js');

const router = new express.Router();

router.post('/drinks', auth, async(req, res) => {
  try {
    const newDrink = new Drink(req.body);
    req.user.ownDrinks.push(newDrink);
    await req.user.save();

    res.status(201).send(newDrink);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/drinks', auth, async(req, res) => {
  try {
    const drinks = req.user.ownDrinks;
    res.send(drinks);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/drinks/:id', auth, async(req, res) => {
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
});

router.patch('/drinks/:id', auth, async(req, res) => {
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
});

router.delete('/drinks/:id', auth, async(req, res) => {
  const drinkId = req.params.id;
  const drinks = req.user.ownDrinks;

  try {
    // Check user owns the drink
    const drink = drinks.id(drinkId);
    drink ?
      res.send(drink) :
      res.status(404).send({ error: 'Drink not found.' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
