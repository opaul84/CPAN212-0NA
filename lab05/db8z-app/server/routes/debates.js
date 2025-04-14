import express from 'express';
import Debate from '../models/Debate.js';
import Message from '../models/Message.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all debates
router.get('/', async (req, res) => {
  try {
    const debates = await Debate.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name avatar')
      .populate('participants', 'name avatar');
    res.json(debates);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific debate
router.get('/:id', async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id)
      .populate('createdBy', 'name avatar')
      .populate('participants', 'name avatar');
    
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    
    res.json(debate);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new debate
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: {
          title: !title ? 'Title is required' : null,
          description: !description ? 'Description is required' : null,
          category: !category ? 'Category is required' : null
        }
      });
    }

    // Validate category
    const validCategories = ['general', 'politics', 'technology', 'science', 'philosophy', 'society', 'economics', 'culture', 'sports'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        message: 'Invalid category',
        details: `Category must be one of: ${validCategories.join(', ')}`
      });
    }
    
    const debate = new Debate({
      title,
      description,
      category,
      createdBy: req.user.id,
      participants: [{
        user: req.user.id,
        role: 'participant',
        joinedAt: new Date()
      }]
    });
    
    await debate.save();
    await debate.populate('createdBy', 'name avatar');
    
    res.status(201).json(debate);
  } catch (error) {
    console.error('Error creating debate:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get messages for a debate
router.get('/:id/messages', async (req, res) => {
  try {
    const messages = await Message.find({ debateId: req.params.id })
      .sort({ createdAt: 1 })
      .populate('userId', 'name avatar');
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Close a debate
router.patch('/:id/close', auth, async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id);
    
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    
    if (debate.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    debate.status = 'closed';
    await debate.save();
    
    res.json(debate);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 