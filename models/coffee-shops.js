const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coffeeShopSchema = mongoose.Schema({
    name: String,
    city: String,
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'}
});

const CoffeeShop = mongoose.model('CoffeeShop', coffeeShopSchema);

module.exports = CoffeeShop;