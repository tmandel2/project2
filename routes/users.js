var express = require('express');
var router = express.Router();
var User = require('../models/users');
const bcrypt = require('bcryptjs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users/show');
});

router.post('/', async (req, res) => {
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const userDbEntry = {};
  userDbEntry.username = req.body.username;
  userDbEntry.email = req.body.email;
  userDbEntry.password = hashedPassword;

  try {
    const createdUser = await User.create(userDbEntry);
    console.log('=====================================');
    console.log(createdUser);
    console.log('=====================================');
    req.session.username = createdUser.username;
    req.session.logged   = true;
    res.redirect('/users');
  } catch (err) {
    res.send(err);
  }
});


module.exports = router;

