const express = require('express');
const {
  createPost
} = require('../controllers/postController');

const router = express.Router({ mergeParams: true });

router.route('/createPost').post(createPost);

module.exports = router;