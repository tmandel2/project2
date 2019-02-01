const mongoose = require('mongoose');
const User = require('./users');
const Schema = mongoose.Schema;

const coffeeShopSchema = mongoose.Schema({
    name: String,
    city: String,
    createdBy: {type: Schema.Types.ObjectId, ref: 'Users'}
});

const CoffeeShop = mongoose.model('CoffeeShop', coffeeShopSchema);

module.exports = CoffeeShop;