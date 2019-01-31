const mongoose = require('mongoose');
const CoffeeShop = require('./coffee-shops');

const usersSchema = mongoose.Schema({
    username: {type: String, unique: true},
    name: String,
    city: String,
    email: String,
    password: String,
    coffeeShops: [CoffeeShop.schema]
});

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;