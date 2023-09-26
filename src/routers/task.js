const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth')
const Task = require('../model/task');

// === TASK ===== TASK ===== TASK ===== TASK ===== TASK ===== TASK ===
router.post('/task', auth, async (req, res) => {
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body, // input from post request; a es6 object function to paste an existing object
        owner: req.user._id
    });
    
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.send(500).send();
    }

    // task.save().then(() => {
    //     res.status(201).send(task);
    // }).catch((e)=> {
    //     res.status(400).send(e);
    // })
});

router.get('/tasks', auth, async (req, res) => {
    // FILTERING, SORTING, PAGINATION 

    const match = {};
    const sort = {};
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    if(req.query.completed) match.completed = req.query.completed === 'true';

    if(req.query.sortBy) {
        const splitArr = req.query.sortBy.split('_');
        sort[splitArr[0]] = splitArr[1] === 'ASC' || splitArr[1] === 'asc' ? 1 : -1;
        console.log(sort);
    }
    
    try {
        // const tasks = await Task.find({});
        // const tasks = await Task.find({ owner: req.user._id }); // first solution for task

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit,
                skip,
                sort
            }
        });
        res.status(200).send(req.user.tasks);
    } catch (error) {
        res.status(500).send();
    }
    
    // Task.find({}).then((tasks) => {
    //     res.status(200).send(tasks);
    // }).catch((e) => {
    //     console.log(e);
    //     res.status(500).send();
    // })
});

router.get('/task/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        // const task = await Task.findById(_id);
        const task = await Task.findOne({ _id, owner: req.user._id});
        if(!task) return res.status(404).send();
        res.status(200).send(task);
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }

    // Task.findById(_id).then((task) => {
    //     if(!task) return res.status(404).send();

    //     res.status(200).send(task);
    // }).catch((e) => {
    //     console.log(e);
    //     res.status(500).send();
    // })
});

router.patch('/task/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const allowedUpdates = ['description', 'completed'];
    const updateKeys = Object.keys(req.body);
    const validateOperation = updateKeys.every(update => allowedUpdates.includes(update));
    console.log(updateKeys, allowedUpdates, validateOperation);

    if(!validateOperation) return res.status(400).send({error: 'Invalid update attribute'});

    try {
        // const task = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});
        // const task = await Task.findById(_id);
        const task = await Task.findOne({_id, owner: req.user._id});
        if(!task) return res.status(404).send();

        updateKeys.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task); //didn't set status as this is the default status code 200-success
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

router.delete('/task/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});

        if(!task) return res.status(404).send();
        res.send(task);
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

module.exports = router;