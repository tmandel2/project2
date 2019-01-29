const express = require('express');
const router = express.Router();
const CoffeeShops = require('../models/coffee-shops');

router.get('/', (req, res) => {
    CoffeeShops.find({}, (err, allCoffeeShops) => {
        if(err) {
            console.log(err);
        } else {
            console.log(allCoffeeShops);
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

router.post('/', (req, res) => {
    CoffeeShops.create(req.body, (err, createdCoffee) => {
        if(err) {
            console.log(err);
        } else {
            createdCoffee.createdBy = req.session.userId;
            console.log(req.session);
            createdCoffee.save();
            console.log(createdCoffee);
            res.redirect('/coffee-shops');
        }
    });
});

router.get('/:id', (req, res) => {
    CoffeeShops.findById(req.params.id, (err, foundCoffeeShop) => {
        if (err) {
            console.log(err);
        } else {
            res.render('../views/coffee-shops/show.ejs', {
                coffeeShop: foundCoffeeShop,
                userId: req.session.userId
            });
        }
    });
});

router.delete('/:id', (req, res) => {
    CoffeeShops.findByIdAndRemove(req.params.id, (err, deletedCoffeeShop) => {
        if(err) {
            console.log(err);
        } else {
            console.log("Hitting");
            res.redirect('/coffee-shops')
        }
    });
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

router.put('/:id', (req, res) => {
    CoffeeShops.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, foundCoffeeShop) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/coffee-shops');
        }
    });
});

module.exports = router;