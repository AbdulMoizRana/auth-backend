const User = require('../models/User');
const nodemailer = require("nodemailer");
const Setting = require('../models/Setting');

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
                text: `your otp is ${otp}`, // plain text body
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
                    message: 'Your details added',
                    email: user.email,
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

exports.signUp = async (req, res) => {
    try {
        const { fullName, password, email } = req.body;
        let errors = [];
        if (!fullName) {
            errors.push('fullName is requied');
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
            return res.status(400).json({
                status: 'Fail',
                message: 'Email already exist',
            });
            // if (user?.status === "Active") {
            //     user.fullName = fullName;
            //     user.password = password;
            //     await user.save();

            //     return res.status(201).json({
            //         status: 'Success',
            //         message: 'Your details added',
            //         email: user.email,
            //     });
            // }
            // else {
            //     return res.status(400).json({
            //         status: 'Fail',
            //         message: 'Please verify your email first',
            //     });
            // }
        }
        else {
            const newUser = await User.insertMany([{ fullName:fullName, password:password, email:email }]);
            const settingParam = {
                userId: newUser._id
            }
            await Setting.insertMany([settingParam]);
                 return res.status(201).json({
                    status: 'Success',
                    message: 'Your details added',
                    email: newUser.email,
                });
        }
    } catch (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.profileSetup = async (req, res) => {
    try {
        const { userName, gender, planet, country, postalCode, email} = req.body;
        let errors = [];
        // if (!userName) {
        //     errors.push('userName is requied');
        // }
        if (!gender) {
            errors.push('gender is requied');
        }
        if (!planet) {
            errors.push('planet is requied');
        }
        if (!country) {
            errors.push('country is requied');
        }
        if (!postalCode) {
            errors.push('postalCode is requied');
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
            const newUser = await User.findByIdAndUpdate({email:email}, req.body,
                function (err, docs) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        return res.status(200).json({
                            status: 'Changes are saved',
                        });
                    }
                });
        }
        else {
            return res.status(400).json({
                status: 'Fail',
                message: 'user not found',
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

exports.savePost = async (req, res) => {
    try {
        const { userId, postId} = req.body
        let errors = [];
        if (!userId) {
            errors.push('userId is requied');
        }
        if (!postId) {
            errors.push('postId of post is requied');
        }
        if (errors.length > 0) {
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false,
            });
        }
        const user = await User.findOne({
            _id: userId
        });
        const savedPosts = post?.savedPosts
        savedPosts.push(postId);
        const newUser = User.findByIdAndUpdate(userId, {savedPosts:savedPosts},
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    return res.status(200).json({
                        status: 'Post have re shared',
                    });
                }
            });
        // let post = await new Post(req.body);

        // await post.save();
       

    } catch (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        const { userId } = req.query;
        const user = User.find({_id:userId},
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    return res.status(200).json({
                        status: 'User data',
                        data : docs
                    });
                }
            });
        // let post = await new Post(req.body);

        // await post.save();
       

    } catch (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.addFriendsRequest = async (req, res) => {
    try {
        const { userId, friendId} = req.body
        let errors = [];
        if (!userId) {
            errors.push('userId is requied');
        }
        if (!friendId) {
            errors.push('postId of post is requied');
        }
        if (errors.length > 0) {
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false,
            });
        }
        const user = await User.findOne({
            _id: userId
        });
        const friendRequests = user?.friendRequests
        friendRequests.push(friendId);
        const newuser = User.findByIdAndUpdate(userId, {friendRequests:friendRequests},
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    return res.status(200).json({
                        status: 'Friend request sent',
                    });
                }
            });
        // let post = await new Post(req.body);

        // await post.save();
       

    } catch (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};
exports.removeFriendRequest = async (req, res) => {
    try {
        const { userId, friendId} = req.body
        let errors = [];
        if (!userId) {
            errors.push('userId is requied');
        }
        if (!friendId) {
            errors.push('postId of post is requied');
        }
        if (errors.length > 0) {
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false,
            });
        }
        const user = await User.findOne({
            _id: userId
        });
        let friendRequests = user?.friendRequests;
        friendRequests = friendRequests.filter(item => item !== friendId);
        const newPost = User.findByIdAndUpdate(userId, {friendRequests:friendRequests},
            function (err, docs) {
                if (err) {
                    return res.status(400).json({
                        status: 'Fail',
                        message: err,
                    });
                }
                else {
                    return res.status(200).json({
                        status: 'You remove the friend request',
                    });
                }
            });
        // let post = await new Post(req.body);

        // await post.save();
       

    } catch (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.acceptFriendsRequest = async (req, res) => {
    try {
        const { userId, friendId} = req.body
        let errors = [];
        if (!userId) {
            errors.push('userId is requied');
        }
        if (!friendId) {
            errors.push('friendId of post is requied');
        }
        if (errors.length > 0) {
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false,
            });
        }
        const user = await User.findOne({
            _id: userId
        });
        let friendRequests = user?.friendRequests;
        friendRequests = friendRequests.filter(item => item !== friendId);
        const newuser = User.findByIdAndUpdate(userId, {friendRequests:friendRequests},
            function (err, docs) {
                if (err) {
                    console.log("a",docs)
                    return res.status(400).json({
                        status: 'Fail',
                        message: err,
                    });
                }
                else {
                    let friends = user?.friends;
                    friends.push(friendId);
                    const newuser2 = User.findByIdAndUpdate(userId, {friends:friends},
                        function (err, docs) {
                            if (err) {
                                console.log("b",docs)
                                return res.status(400).json({
                                    status: 'Fail',
                                    message: err,
                                });
                            }
                            else {
                                return res.status(200).json({
                                    status: 'You are friends',
                                });
                            }
                        });
                }
            });
        // let post = await new Post(req.body);

        // await post.save();
       

    } catch (error) {
        console.log("c",error)
        return res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.unFriends = async (req, res) => {
    try {
        const { userId, friendId} = req.body
        let errors = [];
        if (!userId) {
            errors.push('userId is requied');
        }
        if (!friendId) {
            errors.push('postId of post is requied');
        }
        if (errors.length > 0) {
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false,
            });
        }
        const user = await User.findOne({
            _id: userId
        });
        let friends = user?.friends;
        friends = friends.filter(item => item !== friendId);
        const newPost = User.findByIdAndUpdate(userId, {friends:friends},
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    return res.status(200).json({
                        status: 'You unfriend the user',
                    });
                }
            });
        // let post = await new Post(req.body);

        // await post.save();
       

    } catch (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.getFriendRequests = async (req, res) => {
    try {
        const { userId } = req.query;
        const user = User.find({_id:userId},
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    return res.status(200).json({
                        status: 'User data',
                        data : docs
                    });
                }
            });
        // let post = await new Post(req.body);

        // await post.save();
       

    } catch (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.getFriends = async (req, res) => {
    try {
        const { userId } = req.query;
        const user = User.find({_id:userId},
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("sd",docs)
                    return res.status(200).json({
                        status: 'User data',
                        data : docs
                    });
                }
            });
        // let post = await new Post(req.body);

        // await post.save();
       

    } catch (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};