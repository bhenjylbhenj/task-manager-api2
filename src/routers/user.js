const express = require('express');
const multer = require('multer');

const router = new express.Router();
const auth = require('../middleware/auth');
const User = require('../model/user');

router.post('/user', async (req, res) => {
    const user = new User(req.body);
    // user.save().then(() => {
        //     res.status(201);
        //     res.send(user);
        // }).catch((e) => console.log(e));
    try {
        const token = await user.generateAuthToken();
        await user.save();
        console.log(token);
        res.status(201);
        res.send({ user, token });
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }

});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredintials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        console.log(token);
        res.send({ user, token});
    } catch (error) {
        res.status(400).send();
    }    
});

router.get('/users/me', auth, async (req, res) => {
    res.send({user: req.user, token: req.token })

    //pull up the users
    // try {
    //     const users = await User.find({});
    //     res.status(201).send(users);
    // } catch (error) {
    //     res.status(500).send(error);
    // }

    // then catch
    // User.find({}).then((user) => {
    //     res.status(201).send(user);
    // }).catch((e) => {
    //     res.status(500).send(e);
    // })
});

router.get('/user/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        if(!user) return res.status(404).send(); // if cannot find a user
        
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }

    // User.findById(_id).then((user) => {
    //     if(!user) return res.status(404).send();

    //     res.status(200).send(user);
    // }).catch((e) => {
    //     res.status(500).send(e)
    // })
});

router.patch('/user/me', auth, async (req, res) => {
    const updateKeys = Object.keys(req.body); // returns keys from object
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const validateOperation = updateKeys.every((update) => { 
        return allowedUpdates.includes(update);
    })

    if(!validateOperation) return res.status(400).send({error: 'Invalid update attribute'});

    try {
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators: true}); 
        // new:bollean returns if updated document / runValidators:bolean will run validators on schema

        const user = req.user;
        // if(!user) return res.status(404).send();

        updateKeys.forEach((update) => user[update] = req.body[update]);
        await user.save();

        res.status(200).send(user);
    } catch (error) {
        console.log(error)
        res.status(500).send();
    }
});

router.delete('/user/me', auth, async (req, res) => {
    try {
        // await User.findOneAndDelete({ _id: req.user._id});
        // req.user.remove();
        // if(!user) return res.status(404).send();
        // console.log(req.user)

        await req.user.deleteOne(); //I should be using this, the code works but it does not trigger a schema.post/pre middleware
        res.send(req.user);
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
        await req.user.save();
        res.send(req.tokens);
    } catch (error) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

// ----------
const uploadAvatar = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) return cb(new Error('Please upload an image file.'));
        cb(undefined, true);
    }
});

router.post('/users/me/avatar', auth, uploadAvatar.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
});

router.delete('/users/me/avatar', auth, async (req,res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(400).send();
    }
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user || !user.avatar) throw new Error();
        
        res.set('Content-Type', 'image/jpeg');
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send();
    }
});

module.exports = router;