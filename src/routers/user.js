const express = require('express');
const User = require('../models/user');
const authMiddleWare = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');

//create router 
const router = express.Router();

router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.genrateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
    //-----------------------before async await --------------------------------------------------//

    // user.save()
    //     .then(() => {
    //         res.status(201).send(user);
    //     })
    //     .catch((e) => {
    //         res
    //             .status(400)
    //             .send(e);
    //     });
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.genrateAuthToken();
        res.send({
            user,
            token,
        });
    } catch (e) {
        console.log(e);
        res.status(400).send({ Error: e });
    }
});

router.post('/users/logout', authMiddleWare, async (req, res) => {
    try {

        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        await req.user.save();

        res.send('Successfully logout');

    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/users/logoutAll', authMiddleWare, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send('Successsfully Logout from all device');
    } catch (e) {
        res.status(400).send();
    }
});

//Access specific user based on JWT token
router.get('/users/me', authMiddleWare, async (req, res) => {
    try {
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
});

///-------------------------no use after authentication integrate but not remove because it will use as reference in future 
router.get('/users', async (req, res) => {
    try {
        //const user = await User.find({ name: 'Himanshu' });
        const user = await User.find();
        res.send(user);
    } catch (e) {
        res.status(500).send();
    }
    //-----------------------before async await --------------------------------------------------//

    // User.find({ name: 'Himanshu' }).then((user) => {
    //     res.send(user);
    // }).catch((e) => {
    //     res.status(500).send();
    // });
});

router.get('/users/:id', authMiddleWare, async (req, res) => {

    try {
        const _id = req.params.id;
        const user = await User.findById(_id);
        if (!user) {
            return res.status(400).send('User not found');
        }
        res.send(user);
    } catch (e) {
        res.status(500).send();
    }
    //-----------------------before async await --------------------------------------------------//

    // const _id = req.params.id;
    // User.findById(_id).then((user) => {
    //     if (!user) {
    //         return res.status(400).send('User not found');
    //     }
    //     res.send(user);
    // }).catch((e) => {
    //     res.status(500).send(e);
    // });
});

router.patch('/users/me', authMiddleWare, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({
            'error': 'Invalid Updates'
        });
    }

    try {

        //-----------------------------------Before Save Middleware integration--------------------------------------------

        // const user = await User.findByIdAndUpdate(
        //     req.params.id,
        //     req.body,
        //     { new: true, runValidators: true }
        // );

        //-----------------------------------After Save Middleware integration  And Before auth middleware integration--------------------------------------------
        //this is becouse if user has change password that time we have to call save middleware method

        // const user = await User.findById(req.params.id);
        // updates.forEach((single) => user[single] = req.body[single]);
        // await user.save();

        // if (!user) {
        //     return res.status(404).send();
        // }
        // res.send(user);


        ////////-----------------------------after auth middleware------ -----------------------------------//// 
        updates.forEach((el) => req.user[el] = req.body[el]);
        await req.user.save();
        res.send(req.user);

    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/users/me', authMiddleWare, async (req, res) => {
    try {
        ////////-----------------------------before auth middleware-----------------------------------////
        // const user = await User.findByIdAndDelete(req.params.id);
        // if (!user) {
        //     return res.status(400).send({ Error: 'User not found' });
        // } 
        //res.send(user);

        ////////-----------------------------after auth middleware------ -----------------------------------////
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
});

//setup multer path for store uploaded image
const uploads = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg||jpeg||png)$/)) {
            return callback(new Error('File must be a Image'));
        }
        callback(undefined, true);
    }
});

router.post('/users/me/avatar', authMiddleWare, uploads.single('avatar'), async (req, res) => {

    //acess file from multer 
    //req.user.avatar = req.file.buffer;

    const buffer = await sharp(req.file.buffer)
        .resize(250, 250)
        .png()
        .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

router.delete('/users/me/avatar', authMiddleWare, async (req, res) => {
    req.user.avatar = undefined;
    req.user.save();
    res.send();
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);

    } catch (e) {
        res.status(404).send();
    }
});

module.exports = router;