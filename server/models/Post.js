const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 150
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    category: {
      type: String,
      default: 'General',
      enum: ['Technology', 'Travel', 'Food', 'Health', 'Business', 'General', 'Other']
    },
    coverImage: {
      type: String,
      default: ''
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // links to the User model
      required: true
    },
    views: {
      type: Number,
      default: 0
    },
    tags: {
      type: [String],
      default: []
    }
  },
  { timestamps: true } // auto-adds createdAt and updatedAt
);

// Helpful index for pagination/sorting by newest first
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
