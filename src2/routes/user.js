const express = require('express');
const router = express.Router();
const User = require('../model/user')

router.post('/user', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save();
        res.status(201).send(user);        
    } catch (error) {
        console.log(error)
        res.status(400).send();
    }
});

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredintials(req.body.email, req.body.password);
        const token = user.generateAuthToken();
        res.json({user, token})
    } catch (error) {
        res.status(400).send(error);
    }
});

router.patch('/user/:id', async (req, res) => {
    try {
        const allowedUpdates = ['email', 'password', 'firstName', 'lastName'];
        const keyObj = Object.keys(req.body);
        const isAllowed = keyObj.every( key => allowedUpdates.includes(key));

        if(!isAllowed) return res.status(400).json({keyObj, allowedUpdates});

        try {
            const user = await User.findById(req.params.id);
            if(!user) return res.status(404).send();

            keyObj.forEach((key) => user[key] = req.body[key]);

            await user.save();
            res.send(user);
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
        res.send(keyObj)
    } catch (error) {
        
    }
});

module.exports = router;