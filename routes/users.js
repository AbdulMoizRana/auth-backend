const express = require('express');
const {
   sendOtpEmail,
   verifyUser
} = require('../controllers/usersController');

const router = express.Router({ mergeParams: true });

router.route('/sendotp').post(sendOtpEmail);
router.route('/verifyOtp').post(verifyUser);

module.exports = router;