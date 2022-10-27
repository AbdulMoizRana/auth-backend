const Post = require('../models/Post');
const nodemailer = require("nodemailer");

exports.createPost = async (req, res) => {
    try {
        const { postDescription, postUser } = req.body;
        let errors = [];
        if (!postDescription) {
            errors.push('postDescription is requied');
        }
        if (!postUser) {
            errors.push('user of post is requied');
        }
        if (errors.length > 0) {
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false,
            });
        }

        let post = await new Post(req.body);

        await post.save();
        return res.status(200).json({
            status: 'Your post is created',
        });

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
        const post = Post.find(postId,
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    return res.status(200).json({
                        status: 'Post data',
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

exports.getAllPosts = async (req, res) => {
    try {
        const { postId } = req.query;
        const post = Post.find({},
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    return res.status(200).json({
                        status: 'Post data',
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
exports.getPostByType = async (req, res) => {
    try {
        const { postId } = req.query;
        const post = Post.find({postId:postId},
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    return res.status(200).json({
                        status: 'Post data',
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
exports.getPostOfUser = async (req, res) => {
    try {
        const { userId } = req.query;
        const post = Post.find({postUser:userId},
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    return res.status(200).json({
                        status: 'Post data',
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
exports.getPostByAudience = async (req, res) => {
    try {
        const { type } = req.query;
        const post = Post.find({postAudienceType:type},
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    return res.status(200).json({
                        status: 'Post data',
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

exports.likePost = async (req, res) => {
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
        const post = await Post.findOne({
            _id: postId
        });
        const likes = post?.likes
        likes.push(userId);
        const newPost = Post.findByIdAndUpdate(postId, {likes:likes},
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
        const post = await Post.findOne({
            _id: postId
        });
        let likes = post?.likes;
        likes = likes.filter(item => item !== userId)
        const newPost = Post.findByIdAndUpdate(postId, {likes:likes},
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
        const { userId, postId, comment} = req.body
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
        const newPost = Post.findByIdAndUpdate(postId, {comments:comments},
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
        const { commentId, postId} = req.body
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
        const newPost = Post.findByIdAndUpdate(postId, {comments:comments},
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
        const post = await Post.findOne({
            _id: postId
        });
        const reShare = post?.reShare
        reShare.push(userId);
        const newPost = Post.findByIdAndUpdate(postId, {reShare:reShare},
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