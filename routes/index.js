const express = require('express');
const router = express.Router();
const users = require('./users');
const post = require('./posts');
const messages = require('./messages');

router.use('/user', users);
router.use('/post', post);
router.use('/messages', messages);

module.exports = router;
