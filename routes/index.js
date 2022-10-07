const express = require('express');
const router = express.Router();
const users = require('./users');
const post = require('./posts');

router.use('/user', users);
router.use('/post', post);

module.exports = router;
