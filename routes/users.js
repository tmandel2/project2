var express = require('express');
var router = express.Router();
var User = require('../models/users');
var CoffeeShop = require('../models/coffee-shops');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

router.post('/', upload.single('imageFile'), async (req, res) => {
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const userDbEntry = {};
  userDbEntry.username = req.body.username;
  userDbEntry.name = req.body.name;
  userDbEntry.city = req.body.city;
  userDbEntry.email = req.body.email;
  userDbEntry.password = hashedPassword;
  userDbEntry.image = {};
  if (req.file) {
    const imageFilePath = './uploads/' + req.file.filename;
    userDbEntry.image.data = fs.readFileSync(imageFilePath);
    userDbEntry.image.contentType = req.file.mimetype;
    fs.unlinkSync(imageFilePath);
  }
   
  try {
    const createdUser = await User.create(userDbEntry);
    req.session.username = createdUser.username;
    req.session.logged = true;
    req.session.userId = createdUser._id;
    res.redirect(`/users/${createdUser._id}`);
  } catch (err) {
    res.send(err);
  }
});


router.post('/login', async (req, res) => {
  try {
    const foundUser = await User.findOne({username: req.body.username});
    if(foundUser){
      if(bcrypt.compareSync(req.body.password, foundUser.password) && req.body.email === foundUser.email) {
        req.session.message = '';
        req.session.username = foundUser.username;
        req.session.logged = true;
        req.session.userId = foundUser._id;
        res.redirect(`/users/${foundUser._id}`);
      } else {
        req.session.message = "Incorrect username or password.";
        res.redirect('/');
      }
    } else {
      req.session.message = "User does not exist";
      res.redirect('/');
    }
  } catch(err) {
    res.send(err);
  }
})


router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if(err){
      res.send(err);
    } else {
      res.redirect('/');
    }
  });
});

router.get('/:id/image', async (req, res) => {
    const foundUser = await User.findById(req.params.id);
    const image = foundUser.image;
    res.set('Content-Type', image.contentType);
    res.send(image.data);
});


router.get('/:id', function(req, res) {
  User.findById(req.params.id, (err, foundUser) => {
    res.render('../views/users/show.ejs', {
      user: foundUser,
      userId: req.session.userId
    });
  });
});

router.delete('/:id', (req, res) => {
  User.findOneAndDelete({_id: req.params.id}, (err, deletedUser) => {
    const userPosts = [];
    deletedUser.coffeeShops.forEach(coffeeShop => {
      userPosts.push(coffeeShop)
    })
    CoffeeShop.deleteMany({_id: {$in: userPosts}}, (err, data) => res.redirect('/'))
  })
});

router.get('/:id/edit', (req, res) => {
  Users.findById(req.params.id, (err, foundUser) => {
      if(err) {
          console.log(err);
      } else {
          res.render('../views/coffee-shops/edit.ejs', {
              user: foundUser,
          });
      }
  });
});

module.exports = router;

