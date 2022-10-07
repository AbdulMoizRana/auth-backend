const express = require('express');
const {
  createPost,
  editPost,
  delPost,
  getPost,
  getAllPosts,
  getPostByType,
  getPostOfUser,
  getPostByAudience
} = require('../controllers/postController');

const router = express.Router({ mergeParams: true });

router.route('/createPost').post(createPost);
router.route('/editPost').post(editPost);
router.route('/delPost').delete(delPost);
router.route('/getPost').get(getPost);
router.route('/getAllPost').get(getAllPosts);
router.route('/getPostByType').get(getPostByType);
router.route('/getPostOfUser').get(getPostOfUser);
router.route('/getPostByAudience').get(getPostByAudience);

module.exports = router;