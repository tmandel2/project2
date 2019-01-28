const mongoose = require('mongoose');

const coffeeShopSchema = mongoose.Schema({
    name: String,
    city: String,
});

const CoffeeShop = mongoose.model('CoffeeShop', coffeeShopSchema);

module.exports = CoffeeShop;