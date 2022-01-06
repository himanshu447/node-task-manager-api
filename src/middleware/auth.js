const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleWare = async (req, res, next) => {

    try {
        const userProivdeToken = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(userProivdeToken, process.env.JWTSECRATEKEY);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': userProivdeToken });

        if (!user) {
            throw Error();
        }
        req.token = userProivdeToken;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({ Error: 'Please Authenticate.' });
    }
}

module.exports = authMiddleWare;