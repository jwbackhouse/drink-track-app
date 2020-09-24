const express = require('express');
const { Drink } = require('../models/drinks.js');
const User = require('../models/users.js');
const auth = require('../middleware/auth.js');

const router = new express.Router();

router.post('/drinks', auth, async(req, res) => {
  try {
    const newDrink = new Drink({
      ...req.body,
      owner: req.user._id
    });
    await newDrink.save();

    res.status(201).send(newDrink);
  }
  catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/drinks', auth, async(req, res) => {
  try {
    const drinks = req.user.ownDrinks;
    res.send(drinks);
  }
  catch (err) {
    res.status(500).send(err);
  }
});

router.get('/drinks/:id', auth, async(req, res) => {
  const drinkId = req.params.id;
  const drinks = req.user.ownDrinks;

  try {
    const drink = await drinks.findOne({ _id: drinkId });

    drink
      ? res.send(drink)
      : res.status(404).send({ error: 'Drink not found' });


  // const ownerId = req.user._id;

  // try {
  //   const drink = await Drink.findOne({
  //     $or: [
  //       { owner: ownerId },
  //       { owner: { $exists: false } } // include drinks with no owner
  //     ],
  //     _id: drinkId,
  //   });

  //   if (drink.length === 0) return res.status(404).send({ error: 'Drink not found.' });

  //   res.send(drink);
  }
  catch (err) {
    res.status(500).send(err);
  }
});

router.patch('/drinks/:id', auth, async(req, res) => {
  const _id = req.params.id;
  const opts = {
    new: true,
    runValidators: true,
  };
  const query = {
    _id,
    owner: req.user._id // Check drink is owned by user
  };

  try {
    // Check key can be updated
    const updateFields = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'abv', 'size', 'price'];
    const isValidUpdate = updateFields.every(update => allowedUpdates.includes(update));
    if (!isValidUpdate) return res.status(400).send({ error: 'Invalid operation.' });

    const drink = await Drink.findOneAndUpdate(query, req.body, opts);
    if (!drink) return res.status(404).send({ error: 'Drink not found' });
    res.send(drink);
  }
  catch (err) {
    res.status(400).send(err.message);
  }
});

router.delete('/drinks/:id', auth, async(req, res) => {
  const _id = req.params.id;

  try {
    // Check user owns the drink
    const deleted = await Drink.findOneAndDelete({ _id, owner: req.user._id });
    deleted ?
      res.send(deleted) :
      res.status(404).send({ error: 'Drink not found.' });
  }
  catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
