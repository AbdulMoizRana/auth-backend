const User = require('../models/User');
const nodemailer = require("nodemailer");
const Setting = require('../models/Setting');
const { json } = require('express/lib/response');


exports.forgetPassword = async (req, res) => {
    try {
        console.log("here forgery")
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
        if (userfind) {
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
                text: `your code to change password is ${otp}`, // plain text body
                //   html: `<h1>Forget Password</h1><h2>Hello ${email}</h2><p>To change your password click here</p><a href=${WEBSITE_LINK}/${otp}> Click here</a></div>`
            });

            // let user = new User({
            //     email,
            //     otp
            // });
            let user = await User.findByIdAndUpdate(userfind._id, {
                forgetPasswordCode: otp
            })

            // await user.save();

            return res.status(201).json({
                status: 'Success',
                message: 'Email with code sent to your registerd account successfully',
                code: otp
            });
        }
        else {
            return res.status(400).json({
                status: 'Fail',
                message: 'user not exists',
            });
        }
    } catch (err) {
        return res.status(400).json({
            status: 'Fail',
            message: err,
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { code, newPassword } = req.body;
        let errors = [];
        if (!code) {
            errors.push('code');
        }
        if (!newPassword) {
            errors.push('newPassword');
        }
        if (errors.length > 0) {
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false,
            });
        }
        const user = await User.findOne({
            forgetPasswordCode: code,
        });
        if (!user) {
            return res.status(400).json({
                status: 'Fail',
                message: 'User Not found.',
            });
        }
        else {
            user.password = newPassword
            user.forgetPasswordCode = null;
            await user.save();

            return res.status(201).json({
                status: 'Success',
                message: 'Your password updated',
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

exports.updatePassword = async (req, res) => {
    try {
        const { id, newPassword, oldPassword } = req.body;
        let errors = [];
        if (!id) {
            errors.push('id');
        }
        if (!newPassword) {
            errors.push('newPassword');
        }
        if (!oldPassword) {
            errors.push('oldPassword');
        }
        if (errors.length > 0) {
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false,
            });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({
                status: 'Fail',
                message: 'User Not found.',
            });
        }
        else {
            if (user.password == oldPassword) {
                user.password = newPassword
                await user.save();
                return res.status(201).json({
                    status: 'Success',
                    message: 'Your password updated',
                    email: user.email
                });
            }
            else {
                return res.status(400).json({
                    status: 'Fail',
                    message: 'Password is incorrect',
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
            const newUser = await User.insertMany([{ fullName: fullName, password: password, email: email }]);
            console.log("hjko", newUser, newUser[0]._id)
            const settingParam = {
                userId: newUser[0]._id
            }
            const set = await Setting.insertMany([settingParam]);
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
        const { userName, gender, planet, country, postalCode, email, fullName } = req.body;
        let errors = [];
        if (!userName) {
            errors.push('userName is requied');
        }
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
            const newUser = await User.findByIdAndUpdate(user._id, req.body,
                function (err, docs) {
                    if (err) {
                        return res.status(200).json({
                            err: err
                        });
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
                user.password = undefined;
                return res.status(201).json({
                    status: 'Success',
                    message: 'login success',
                    user: user,
                });
            }
            else {
                return res.status(400).json({
                    status: 'Fail',
                    message: 'Please enter correct password, email or username',
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
        const { userId, postId } = req.body
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
        const savedPosts = user?.savedPosts
        savedPosts.push(postId);
        const newUser = User.findByIdAndUpdate(userId, { savedPosts: savedPosts },
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    return res.status(200).json({
                        status: 'Post have been saved',
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
        const user = User.find({ _id: userId },
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                  const respData = docs[0];
                  respData.password = undefined;
                    return res.status(200).json({
                        status: 'User data',
                        data: respData
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

exports.getAllUsers = async (req, res) => {
    try {
        // const { userId } = req.query;
        const user = User.find({},
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                  let respData = [];
                  docs?.map((item,index)=>{
                      item.password = undefined;
                      respData?.push(item);
                  })
                    return res.status(200).json({
                        status: 'User data',
                        data: respData
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
        const { userId, friendId } = req.body
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
            _id: friendId
        });
        const friendRequests = user?.friendRequests
        friendRequests.push(userId);
        const newuser = User.findByIdAndUpdate(friendId, { friendRequests: friendRequests },
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
        const { userId, friendId } = req.body
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
        const newPost = User.findByIdAndUpdate(userId, { friendRequests: friendRequests },
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
        const { userId, friendId } = req.body
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
        const newuser = User.findByIdAndUpdate(userId, { friendRequests: friendRequests },
            function (err, docs) {
                if (err) {
                    console.log("a", docs)
                    return res.status(400).json({
                        status: 'Fail',
                        message: err,
                    });
                }
                else {
                    let friends = user?.friends;
                    friends.push(friendId);
                    const newuser2 = User.findByIdAndUpdate(userId, { friends: friends },
                        function (err, docs) {
                            if (err) {
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
        return res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.unFriends = async (req, res) => {
    try {
        const { userId, friendId } = req.body
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
        const newPost = User.findByIdAndUpdate(userId, { friends: friends },
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
        const user = User.find({ _id: userId },
          async  function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    // console.log("641506403fe144001430f567",docs)
                    // const respData = [];
                    // for (let index = 0; index < docs.friends.length; index++) {
                    //     const element = docs.friends[index];
                    //     respData.push({
                    //         "status": element.status,
                    //         "gender": element.gender,
                    //         "planet": element.planet,
                    //         "friends": element.friends,
                    //         "_id": element._id,
                    //         "fullName": element.fullName,
                    //         "email": element.email,
                    //     })
                        
                    // }
                    const friendsData = await User.find({_id:{$in:docs[0].friendRequests}})
                    let respData = [];
                    friendsData?.map((item,index)=>{
                       item.password = undefined
                      respData?.push(item);
                  })
                    return res.status(200).json({
                        status: 'User data',
                        data: respData
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
        const user = User.find({ _id: userId },
           async function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    const friendsData = await User.find({_id:{$in:docs[0].friends}})
                    let respData = [];
                    friendsData?.map((item,index)=>{
                       item.password = undefined
                      respData?.push(item);
                  })
                    return res.status(200).json({
                        status: 'User data',
                        data: respData
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