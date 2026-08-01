const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// GET /api/posts — Get all posts (public), supports pagination via ?page=&limit=
router.get('/', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 9, 50);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'username avatar')
        .sort({ createdAt: -1 }) // newest first
        .skip(skip)
        .limit(limit),
      Post.countDocuments(filter)
    ]);

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit) || 1,
      totalPosts: total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/posts/:id — Get single post (public), increments view count
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }, // increment view counter
      { new: true }
    ).populate('author', 'username avatar bio');

    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(500).json({ error: err.message });
  }
});

// POST /api/posts — Create post (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, category, coverImage, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const post = new Post({
      title,
      content,
      category,
      coverImage,
      tags,
      author: req.user.id // from JWT token
    });

    await post.save();
    const populated = await post.populate('author', 'username avatar');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/posts/:id — Update post (auth + owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own posts' });
    }

    const { title, content, category, coverImage, tags } = req.body;
    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, category, coverImage, tags },
      { new: true, runValidators: true }
    ).populate('author', 'username avatar');

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/posts/:id — Delete post (auth + owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own posts' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
