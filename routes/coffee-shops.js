const express = require('express');
const router = express.Router();
const CoffeeShops = require('../models/coffee-shops');
const User = require('../models/users');


router.get('/', (req, res) => {
    CoffeeShops.find({}, (err, allCoffeeShops) => {
        if(err) {
            console.log(err);
        } else {
            res.render('../views/coffee-shops/index.ejs', {
                coffeeShops: allCoffeeShops,
                userId: req.session.userId
            });
        }
    });
});

router.get('/new', (req, res) => {
    res.render('../views/coffee-shops/new.ejs', {
        userId: req.session.userId
    });
});

router.post('/', async (req, res) => {
    try {
        const createdShop = await CoffeeShops.create(req.body);
        const foundUser = await User.findById(req.session.userId);
        createdShop.createdBy = foundUser._id;
        createdShop.save();
        foundUser.coffeeShops.push(createdShop)
        foundUser.save();
        res.redirect('/coffee-shops');
    } catch (err) {
        console.log(err);
    }
    
});

router.get('/:id', async (req, res) => {
    try {
        foundCoffeeShop = await CoffeeShops.findById(req.params.id).populate('createdBy');
        foundUser = await User.findById(foundCoffeeShop.createdBy);
        res.render('../views/coffee-shops/show.ejs', {
            coffeeShop: foundCoffeeShop,
            user: foundUser,
            currentUser: req.session.userId
        });
    } catch (err) {
        console.log(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        deletedCoffeeShop = await CoffeeShops.findByIdAndRemove(req.params.id);
        foundUser = await User.findById(deletedCoffeeShop.createdBy);
        foundUser.coffeeShops.id(req.params.id).remove();
        foundUser.save();
        res.redirect('/coffee-shops');
    } catch(err) {
        console.log(err);
    }
});

router.get('/:id/edit', (req, res) => {
    CoffeeShops.findById(req.params.id, (err, foundCoffeeShop) => {
        if(err) {
            console.log(err);
        } else {
            res.render('../views/coffee-shops/edit.ejs', {
                coffeeShop: foundCoffeeShop,
                userId: req.session.userId
            });
        }
    });
});

router.put('/:id', async (req, res) => {
    try {
        updatedCoffeeShop = await CoffeeShops.findByIdAndUpdate(req.params.id, req.body, {new: true});
        foundUser = await User.findById(updatedCoffeeShop.createdBy);
        foundUser.coffeeShops.id(req.params.id).remove();
        foundUser.coffeeShops.push(updatedCoffeeShop);
        foundUser.save();
        res.redirect('/coffee-shops');
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;