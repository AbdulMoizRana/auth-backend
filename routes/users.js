const express = require('express');
const {
   sendOtpEmail,
   verifyUser,
   addDetails,
   login,
   signUp,
   profileSetup,
   savePost,
   getUser,
   getFriendRequests,
   getFriends,
   addFriendsRequest,
   acceptFriendsRequest,
   unFriends,
   removeFriendRequest,
   forgetPassword,
   changePassword
} = require('../controllers/usersController');

const router = express.Router({ mergeParams: true });

router.route('/sendotp').post(sendOtpEmail);
router.route('/verifyOtp').post(verifyUser);
router.route('/addDetails').post(addDetails);
router.route('/signUp').post(signUp);
router.route('/login').post(login);
router.route('/profileSetup').post(profileSetup);
router.route('/savePost').post(savePost);
router.route('/getUser').get(getUser);
router.route('/getFriends').get(getFriends);
router.route('/getFriendRequest').get(getFriendRequests);
router.route('/addFriendsRequest').post(addFriendsRequest);
router.route('/acceptFriendsRequest').post(acceptFriendsRequest);
router.route('/unFriends').post(unFriends);
router.route('/removeFriendRequest').post(removeFriendRequest);
router.route('/forgetPassword').post(forgetPassword);
router.route('/changePassword').post(changePassword);

module.exports = router;