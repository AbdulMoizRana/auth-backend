const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    postTitle: {
      type: String,
    },
    postDescription: {
      type: String,
    },
    postPhotos:{
      type : Array,
    },
    postType:{
      type: String,
      enum:['Photo', 'Bulletin', 'Blog'],
      default: 'Photo',
    },
    tags: {
      type: Array,
    },
    nsfw: {
      type: Boolean,
      default: false
    },
    postAudienceType: {
      type: String, 
      enum: ['Public', 'Friends', 'onlyme'],
      default: 'Public'
    },
    postUser: {
      type: String,
    },
    tagUsers: {
      type: Array,
    },
    postAudience: { 
      type: Array,
    },

  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
