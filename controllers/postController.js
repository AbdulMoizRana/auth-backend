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

        let post = new Post(req.body);

        await post.save();

      
    } catch (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};