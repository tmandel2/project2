const express = require('express');
const router = express.Router();
const CoffeeShops = require('../models/coffee-shops');
const User = require('../models/users');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');


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

//ADDING MULTER
router.post('/', upload.single('imageFile'), async (req, res) => {
    //NEED TO BREAK IT OUT SO MULTER CAN PUT REQUIRED IMAGE INFO IN

    const foundUser = await User.findById(req.session.userId);
    const createThisShop = {};
    createThisShop.name = req.body.name;
    createThisShop.city = req.body.city;
    createThisShop.createdBy = foundUser._id;
    createThisShop.menu = req.body.menu;
    createThisShop.upVote = [];
    createThisShop.image = {};
    if (req.file) {
        const imageFilePath = './uploads/' + req.file.filename;
        createThisShop.image.data = fs.readFileSync(imageFilePath);
        createThisShop.image.contentType = req.file.mimetype;
        fs.unlinkSync(imageFilePath);
    }
    try {

        const createdShop = await CoffeeShops.create(createThisShop);
        await createdShop.save();
        foundUser.coffeeShops.push(createdShop)
        await foundUser.save();
        res.redirect('/coffee-shops');
    } catch (err) {
        console.log(err);
    }
    
});


// TO ACCESS THE IMAGES
router.get('/:id/image', async (req, res) => {
    const foundCoffeeShop = await CoffeeShops.findById(req.params.id);
    const image = foundCoffeeShop.image;
    res.set('Content-Type', image.contentType);
    res.send(image.data);
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

router.put('/:id/upvote', async (req, res) => {
    try {
        let alreadyVoted = false;
        // finding creator
        const foundShop = await CoffeeShops.findById(req.params.id);
        for (let i = 0; i < foundShop.upVote.length; i++) {
            if (foundShop.upVote[i].toString() === req.session.userId.toString()){
                alreadyVoted = true;
            }
        }
        if (alreadyVoted) {
            res.redirect(`/coffee-shops/${req.params.id}`)
        } else {
            foundShop.upVote.push(req.session.userId);
            await foundShop.save();
            res.redirect(`/coffee-shops/${req.params.id}`)
        }
    } catch (err) {
        res.send(err)
    }
});

router.put('/:id/favorite', async (req, res) => {
    try {
        const foundShop = await CoffeeShops.findById(req.params.id);
        const foundUser = await User.findById(req.session.userId);
        foundUser.favoriteShop = foundShop._id;
        await foundUser.save();
        res.redirect(`/coffee-shops/${req.params.id}`);
    } catch (err) {
        console.log(err);
    }
})

router.put('/:id', upload.single('imageFile'), async (req, res) => {
    try {
        updatedCoffeeShop = await CoffeeShops.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(req.file) {
            const imageFilePath = './uploads/' + req.file.filename;
            const newPicture = {};
            newPicture.image = {};
            newPicture.image.data = fs.readFileSync(imageFilePath);
            newPicture.image.contentType = req.file.mimetype;
            fs.unlinkSync(imageFilePath);
            updatedCoffeeShop.image = newPicture.image;
            await updatedCoffeeShop.save();
        }
        foundUser = await User.findById(updatedCoffeeShop.createdBy);
        foundUser.coffeeShops.id(req.params.id).remove();
        foundUser.coffeeShops.push(updatedCoffeeShop);
        await foundUser.save();
        res.redirect('/coffee-shops');
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;