const User = require('../models/User');
const nodemailer = require("nodemailer");

exports.sendOtpEmail = async (req, res) => {
    try {
        const { email } = req.body;
        let errors = [];
        let duplicate = false;
        if (!email) {
            errors.push('email');
        }
        if (errors.length > 0) {
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false,
            });
        }
        const userfind = await User.findOne({
            email: email,
        })
        if (!userfind) {
            const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let otp = '';
            for (let i = 0; i < 5; i++) {
                otp += characters[Math.floor(Math.random() * characters.length)];
            }
            const transport = await nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'confirmationformail@gmail.com',
                    pass: 'khedrdaffewfsdxc'
                }
            });
            let info = await transport.sendMail({
                from: 'nodemailer', // sender address
                to: email, // list of receivers
                subject: "Please confirm your account",
                text: `your otp is${otp}`, // plain text body
                //   html: `<h1>Email Confirmation</h1><h2>Hello ${email}</h2><p>Thank you for subscribing. Please confirm your email by clicking on the following link</p><a href=${WEBSITE_LINK}/${otp}> Click here</a></div>`
            });

            let user = new User({
                email,
                otp
            });

            await user.save();

            return res.status(201).json({
                status: 'Success',
                message: 'Email sent successfully',
                otp: otp
            });
        }
        else {
            return res.status(400).json({
                status: 'Success',
                message: 'user already exists',
            });
        }
    } catch (err) {
        return res.status(400).json({
            status: 'Fail',
            message: err,
        });
    }
};

exports.verifyUser = async (req, res) => {
    try {
        const { otp } = req.body;
        let errors = [];
        if (!otp) {
            errors.push('otp');
        }
        if (errors.length > 0) {
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false,
            });
        }
        const user = await User.findOne({
            otp: otp,
        });
        if (!user) {
            return res.status(400).json({
                status: 'Fail',
                message: 'User Not found.',
            });
        }
        else {
            user.status = "Active";
            user.otp = null;
            await user.save();

            return res.status(201).json({
                status: 'Success',
                message: 'Your Email is now verified',
                email: user.email
            });
        }
    } catch (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.addDetails = async (req, res) => {
    try {
        const { userName, password, email } = req.body;
        let errors = [];
        if (!userName) {
            errors.push('userName is requied');
        }
        if (!password) {
            errors.push('password is requied');
        }
        if (!email) {
            errors.push('email is requied');
        }
        if (errors.length > 0) {
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false,
            });
        }
        const user = await User.findOne({
            email: email,
        });
        if (user) {
            if (user?.status === "Active") {
                user.userName = userName;
                user.password = password;
                await user.save();

                return res.status(201).json({
                    status: 'Success',
                    message: 'Your Email is now verified',
                    email: user.email,
                    userName: user.userName,
                    password: user.password
                });
            }
            else {
                return res.status(400).json({
                    status: 'Fail',
                    message: 'Please verify your email first',
                });
            }

        }
        else {
            return res.status(400).json({
                status: 'Fail',
                message: 'User not found',
            });
        }
    } catch (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        let errors = [];
        if (!userName) {
            errors.push('userName or email is requied');
        }
        if (!password) {
            errors.push('password is requied');
        }
        if (errors.length > 0) {
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false,
            });
        }
        let user = await User.findOne({
            email: userName,
        });
        if (user) {
            if (user?.password == password) {
                return res.status(201).json({
                    status: 'Success',
                    message: 'login success',
                    email: user.email,
                });
            }
            else {
                return res.status(400).json({
                    status: 'Fail',
                    message: 'Please enter correct password',
                });
            }

        }
        else {
            user = await User.findOne({
                userName: userName,
            });
            if (user) {
                if (user?.password == password) {
                    return res.status(201).json({
                        status: 'Success',
                        message: 'login success',
                        email: user.email,
                    });
                }
                else {
                    return res.status(400).json({
                        status: 'Fail',
                        message: 'Please enter correct password',
                    });
                }

            }
            else {
                return res.status(400).json({
                    status: 'Fail',
                    message: 'User not found',
                });
            }
        }
    } catch (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};