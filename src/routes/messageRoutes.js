const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Message = mongoose.model('Message');

const router = express.Router();

router.use(requireAuth);

router.get('/messages', async (req, res) => {
    const messages = await Message.find({ userId: req.user._id});

    res.send(messages);

});

router.post('/messages', async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res
        .status(422)
        .send({ error: 'You must provide a title and content' });
    }

    try{ 
    const message = new Message({ title, content, userId: req.user._id });
    await message.save();
    res.send(message);
    }
    catch (err) {
        res.status(422).send({ error: err.message });
    }
});

module.exports = router; 
