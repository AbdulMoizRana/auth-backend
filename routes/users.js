const express = require('express');
const {
   sendOtpEmail,
   verifyUser,
   addDetails,
   login
} = require('../controllers/usersController');

const router = express.Router({ mergeParams: true });

router.route('/sendotp').post(sendOtpEmail);
router.route('/verifyOtp').post(verifyUser);
router.route('/addDetails').post(addDetails);
router.route('/login').post(login);

module.exports = router;