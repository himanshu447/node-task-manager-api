const express = require('express');
const Task = require('../models/task');
const authMiddleWare = require('../middleware/auth');

//create router
const router = express.Router();


router.post('/tasks', authMiddleWare, async (req, res) => {

    try {
        ////////-----------------------------before auth middleware-----------------------------------////
        //const task = Task(req.body);

        ////////-----------------------------after auth middleware------ -----------------------------------////
        const task = new Task({
            ...req.body,//copy entire req.body into this object 
            owner: req.user._id,
        });

        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

//GET /task?complete=false  ///return data with false value
//GET /task?complete=true  ///return data with true value
//GET /task  ///return all data
//GET /task?limit=10&skip=0     // limit is used to fetch how many data you want at each request 
//                              // Skip is used to skip the data
//limit=10 skip=10              // i will return 10 data after 10 number means start from 11 and fetch till 20  
//GET /task?sortBy=createdAt_asc  
//GET /task?sortBy=createdAt_desc
router.get('/tasks', authMiddleWare, async (req, res) => {
    try {
        ////////-----------------------------before auth middleware-----------------------------------////
        // const tasks = await Task.find();
        // res.send(tasks);

        ////////-----------------------------after auth middleware------ -----------------------------------////

        //without populate method
        // var map = {
        //     owner: req.user._id
        // };

        // if (req.query.completed) {
        //     map.completed = req.query.completed === 'true'
        // }

        // const tasks = await Task.find(map);

        //With populate method
        const match = {};
        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
        };

        const sort = {};
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split('_');
            sort[parts[0]] = parts[1] === 'asc' ? 1 : -1; ///// 1 is for ASC and -1 is for DESC
        }

        await req.user.populate({
            path: 'myTasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort, 
            }
        }).execPopulate();

        res.send(req.user.myTasks);

    } catch (e) {
        res.status(500).send();
    }
});

router.get('/tasks/:id', authMiddleWare, async (req, res) => {
    try {
        ////////-----------------------------before auth middleware-----------------------------------////

        // const task = await Task.findById(req.params.id);
        // if (!task) {
        //     return res.send('Task not found');
        // }
        // res.send(task);

        ////////-----------------------------after auth middleware------ -----------------------------------////

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).send('Task not found');
        }
        res.send(task);

    } catch (e) {
        res.status(500).send();
    }
});

router.patch('/tasks/:id', authMiddleWare, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowUpdates = ['description'];
    const isValidOperation = updates.every((update) => allowUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ Error: 'Invalid Operation!' });
    }

    try {

        //-----------------------------------Before Middleware integration--------------------------------------------

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true,
        // });


        ////////////-----------------------------------After Middleware integration before Auth middleware --------------------------------------------
        //this is becouse if user has change password that time we have to call save middleware method

        // const task = await Task.find(req.params.id);
        // updates.forEach((single) => task[single] = req.body[single]);
        // await task.save();

        // if (!task) {
        //     return res.status(400).send();
        // }
        // res.send(task);


        ////////-----------------------------after auth middleware------ -----------------------------------////
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((single) => task[single] = req.body[single]);
        await task.save();

        res.send(task);

    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id', authMiddleWare, async (req, res) => {
    try {

        ////////-----------------------------before auth middleware-----------------------------------////
        // const task = await Task.findByIdAndDelete(req.params.id);

        // if (!task) {
        //     return res.status(400).send('Task not found');
        // }
        // res.send(task);

        ////////-----------------------------after auth middleware------ -----------------------------------////
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(400).send('Task not found');
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;