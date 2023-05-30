const Post = require('../models/Post');
const User = require('../models/User');
const nodemailer = require("nodemailer");

// Requiring ObjectId from mongoose npm package
const ObjectId = require('mongoose').Types.ObjectId;

// Validator function
function isValidObjectId(id) {

    if (ObjectId.isValid(id)) {
        if ((String)(new ObjectId(id)) === id)
            return true;
        return false;
    }
    return false;
}

exports.createPost = async (req, res) => {
    try {
        const { postDescription, postUser, postTitle, postType, nsfw, postAudienceType } = req.body;
        let errors = [];
        // if (!postDescription) {
        //     errors.push('postDescription is requied');
        // }
        if (!postUser) {
            errors.push('user of post is requied');
        }
        if (!postTitle) {
            errors.push('post title is requied');
        }
        // if (!postType) {
        //     errors.push('post type is requied');
        // }
        // if (!nsfw) {
        //     errors.push('nsfw is requied');
        // }
        // if (!postAudienceType) {
        //     errors.push('post audienceType is requied');
        // }

        if (errors.length > 0) {
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false,
            });
        }

        const user = await User.findById(postUser);
        if (user) {
            let post = await new Post(req.body);

            await post.save();
            return res.status(200).json({
                status: 'Your post is created',
            });
        } else {
            return res.status(400).json({
                status: 'Fail',
                message: 'User with given id not found',
            });
        }


    } catch (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};
exports.editPost = async (req, res) => {
    try {
        // let errors = [];
        // if (!postDescription) {
        //     errors.push('postDescription is requied');
        // }
        // if (!postUser) {
        //     errors.push('user of post is requied');
        // }
        // if (errors.length > 0) {
        //     errors = errors.join(',');
        //     return res.json({
        //         message: `These are required fields: ${errors}.`,
        //         status: false,
        //     });
        // }

        const { postId } = req.query;
        const post = Post.findByIdAndUpdate(postId, req.body,
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
        // let post = await new Post(req.body);

        // await post.save();


    } catch (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.delPost = async (req, res) => {
    try {
        const { postId } = req.query;
        const post = Post.findByIdAndDelete(postId,
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    return res.status(200).json({
                        status: 'Post is deleted',
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

exports.getPost = async (req, res) => {
    try {
        const { postId } = req.query;
        const post = await Post.findById(postId);
        let respData = [];
        let commentsData = [];
        post.likes.map(async (item) => {
            const likeCheck = await isValidObjectId(item)
            if (likeCheck) {
                const userData = await User.findById(item);
                respData.push(userData);
            }
        })
        post.comments.map(async (item) => {
            const commentCheck = await isValidObjectId(item)
            if (commentCheck) {
                const userData = await User.findById(item);
                commentsData.push(userData);
            }
        })
        post.comments = commentsData;
        post.likes = respData;
        const user = await User.findById(post?.postUser);
        if (user) {
            // const { password, ...userRest } = user;
            user.password = undefined;
            return res.status(200).json({
                status: true,
                message: 'Post data',
                data: {
                    postData: post,
                    userData: user
                }
            });
        }
        else {
            return res.status(200).json({
                status: true,
                message: 'User Of Post is not found',
                data: docs
            });
        }


        // let post = await new Post(req.body);

        // await post.save();


    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error,
        });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const { postId } = req.query;
        const post = await Post.find({});
        let respData = [];
        let commentsData = [];
        //     postlikes?.map((item,index)=>{
        //     //    item.password = undefined
        //       respData?.push(item);
        //   });
        let user;
        const postWithUser = [];
        if (post) {
            for (let index = 0; index < post.length; index++) {
                const element = post[index];
                element.likes.map(async (item) => {
                    const likeCheck = await isValidObjectId(item)
                    if (likeCheck) {
                        const userData = await User.findById(item);
                        respData.push(userData);
                    }
                })
                element.comments.map(async (item) => {
                    const commentCheck = await isValidObjectId(item)
                    if (commentCheck) {
                        const userData = await User.findById(item);
                        commentsData.push(userData);
                    }
                })
                // const postlikes = await User.find({ _id: { $in: element.likes } });
                element.comments = commentsData;
                element.likes = respData;
                const idCheck = await isValidObjectId(element?.postUser)
                if (idCheck) {
                    user = await User.findById(element?.postUser);
                    user.password = undefined;
                    postWithUser.push({
                        postData: element,
                        userData: user
                    })
                }
                else {
                    postWithUser.push({
                        postData: element,
                        userData: {}
                    })
                }
            }
        }
        return res.status(200).json({
            status: true,
            message: 'Post data',
            data: postWithUser
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
exports.getPostByType = async (req, res) => {
    try {
        const { postId } = req.query;
        const post = Post.find({ postId: postId },
          async  function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    let respData = [];
                    let commentsData = [];
                    docs.likes.map(async (item) => {
                        const likeCheck = await isValidObjectId(item)
                        if (likeCheck) {
                            const userData = await User.findById(item);
                            respData.push(userData);
                        }
                    })
                    docs.comments.map(async (item) => {
                        const commentCheck = await isValidObjectId(item)
                        if (commentCheck) {
                            const userData = await User.findById(item);
                            commentsData.push(userData);
                        }
                    })
                    docs.comments = commentsData;
                    docs.likes = respData;
                    return res.status(200).json({
                        status: 'Post data',
                        data: docs
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
exports.getPostOfUser = async (req, res) => {
    try {
        const { userId } = req.query;
        const post = Post.find({ postUser: userId },
          async  function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    let respData = [];
                    let commentsData = [];
                    docs.likes.map(async (item) => {
                        const likeCheck = await isValidObjectId(item)
                        if (likeCheck) {
                            const userData = await User.findById(item);
                            respData.push(userData);
                        }
                    })
                    docs.comments.map(async (item) => {
                        const commentCheck = await isValidObjectId(item)
                        if (commentCheck) {
                            const userData = await User.findById(item);
                            commentsData.push(userData);
                        }
                    })
                    docs.comments = commentsData;
                    docs.likes = respData;
                    return res.status(200).json({
                        status: 'Post data',
                        data: docs
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
exports.getPostByAudience = async (req, res) => {
    try {
        const { type } = req.query;
        const post = Post.find({ postAudienceType: type },
          async  function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    let respData = [];
                    let commentsData = [];
                    docs.likes.map(async (item) => {
                        const likeCheck = await isValidObjectId(item)
                        if (likeCheck) {
                            const userData = await User.findById(item);
                            respData.push(userData);
                        }
                    })
                    docs.comments.map(async (item) => {
                        const commentCheck = await isValidObjectId(item)
                        if (commentCheck) {
                            const userData = await User.findById(item);
                            commentsData.push(userData);
                        }
                    })
                    docs.comments = commentsData;
                    docs.likes = respData;
                    return res.status(200).json({
                        status: 'Post data',
                        data: docs
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

exports.likePost = async (req, res) => {
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
        const post = await Post.findOne({
            _id: postId
        });
        const likes = post?.likes
        likes.push(userId);
        const newPost = Post.findByIdAndUpdate(postId, { likes: likes },
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
        // let post = await new Post(req.body);

        // await post.save();


    } catch (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.unlikePost = async (req, res) => {
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
        const post = await Post.findOne({
            _id: postId
        });
        let likes = post?.likes;
        likes = likes.filter(item => item !== userId)
        const newPost = Post.findByIdAndUpdate(postId, { likes: likes },
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    return res.status(200).json({
                        status: 'You have disliked a post',
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

exports.addComment = async (req, res) => {
    try {
        const { userId, postId, comment } = req.body
        let errors = [];
        if (!userId) {
            errors.push('userId is requied');
        }
        if (!postId) {
            errors.push('postId of post is requied');
        }
        if (!comment) {
            errors.push('comment of post is requied');
        }
        if (errors.length > 0) {
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false,
            });
        }
        const post = await Post.findOne({
            _id: postId
        });
        const comments = post?.comments
        comments.push(req.body);
        const newPost = Post.findByIdAndUpdate(postId, { comments: comments },
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    return res.status(200).json({
                        status: 'your comment have added',
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

exports.removeComment = async (req, res) => {
    try {
        const { commentId, postId } = req.body
        let errors = [];
        if (!commentId) {
            errors.push('commentId is requied');
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
        const post = await Post.findOne({
            _id: postId
        });
        let comments = post?.comments;
        comments = comments.filter(item => item?._id != commentId);
        const newPost = Post.findByIdAndUpdate(postId, { comments: comments },
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    return res.status(200).json({
                        status: 'Your comment have removed',
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

exports.reShare = async (req, res) => {
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
        const post = await Post.findOne({
            _id: postId
        });
        const reShare = post?.reShare
        reShare.push(userId);
        const newPost = Post.findByIdAndUpdate(postId, { reShare: reShare },
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