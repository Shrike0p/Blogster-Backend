const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/auth');

const prisma = new PrismaClient();

// Bulk API to fetch all blogs with pagination
router.get('/bulk', async (req, res) => {
  const { page = 1, limit = 10, sort = 'date' } = req.query;
  const offset = (page - 1) * limit;

  try {
    const totalBlogs = await prisma.post.count(); // Get the total number of blogs

    const orderBy = {
      date: { createdAt: 'desc' },
      likes: { likesCount: 'desc' },
      comments: { commentsCount: 'desc' }
    }[sort] || { createdAt: 'desc' };

    const blogs = await prisma.post.findMany({
      skip: parseInt(offset), // Skip blogs for previous pages
      take: parseInt(limit), // Limit the number of blogs per page
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy,
    });

    const totalPages = Math.ceil(totalBlogs / limit); // Calculate total number of pages

    // Send the response with blogs and pagination data
    res.json({
      blogs,         // Array of blog objects
      totalPages,    // Total number of pages
      currentPage: parseInt(page), // Current page number
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});
// Search blogs by title or content with pagination and sorting
router.get('/search', async (req, res) => {
  const { query = "", page = 1, limit = 10, sort = 'date' } = req.query;
  const offset = (page - 1) * limit;

  try {
    const orderBy = {
      date: { createdAt: 'desc' },
      likes: { likesCount: 'desc' },
      comments: { commentsCount: 'desc' }
    }[sort] || { createdAt: 'desc' };

    const totalBlogs = await prisma.post.count({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } }
        ]
      }
    });

    const blogs = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } }
        ]
      },
      skip: parseInt(offset),
      take: parseInt(limit),
      orderBy
    });

    const totalPages = Math.ceil(totalBlogs / limit); // Calculate total number of pages

    res.json({
      blogs,
      totalPages,
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error searching blogs:', error);
    res.status(500).json({ error: 'Failed to search blogs' });
  }
});


// Fetch a specific blog post by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        comments: {
          select: {
            text: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({ blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Create a new blog post
router.post('/', authenticateToken, async (req, res) => {
  const { title, content } = req.body;

  try {
    const blog = await prisma.post.create({
      data: {
        title,
        content,
        authorId: req.user.id
      }
    });
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// Like a blog post
router.post('/:id/like', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const existingLike = await prisma.like.findFirst({
      where: { postId: id, userId: req.user.id }
    });

    if (existingLike) {
      return res.status(400).json({ message: 'You already liked this post' });
    }

    await prisma.like.create({
      data: {
        postId: id,
        userId: req.user.id
      }
    });

    await prisma.post.update({
      where: { id },
      data: { likesCount: { increment: 1 } }
    });

    res.json({ message: 'Liked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to like blog post' });
  }
});

// Add a comment to a blog post
router.post('/:id/comment', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { comment_text } = req.body;

  try {
    await prisma.comment.create({
      data: {
        postId: id,
        userId: req.user.id,
        text: comment_text
      }
    });

    await prisma.post.update({
      where: { id },
      data: { commentsCount: { increment: 1 } }
    });

    res.json({ message: 'Comment added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

module.exports = router;
