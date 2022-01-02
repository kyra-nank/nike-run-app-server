const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = new User({ email, password });
        await user.save(); // async operation since reaching out over internet

        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
        res.send({ token: token });
    } catch (err) {
        return res.status(422).send(err.message); // indicates invalid data to create new user
    }

});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).send({ error: 'Must provide email and password' })
    }

    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(422).send({ error: 'Invalid password or email' })
    }

    try { // once user validated, create token and send it back so they can be authenticated
        await user.comparePassword(password); // wrap in try/catch since promise may be rejected
        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY')
        res.send({ token: token });
    } catch (err) {
        return res.status(422).send({ error: 'Invalid password or email' })
    }
});

module.exports = router;