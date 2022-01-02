const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    // authorization === 'Bearer sidfnsof12323f'

    if (!authorization) {
        return res.status(401).send({ error: 'You must be logged in' });
    }

    const token = authorization.replace('Bearer ', ''); // leaves us with just the token
    jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: 'You must be logged in.' })
        }

        const { userId } = payload;

        const user = await User.findById(userId); // tells mongoose to look at mongodb collection and find user
        req.user = user;
        next(); // sign that our middleware is done running, move to next middleware in the chain of middlewares
    })
};