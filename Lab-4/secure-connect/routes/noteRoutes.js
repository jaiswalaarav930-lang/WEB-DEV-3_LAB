const express = require('express');
const Note = require('../models/Note');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const appEvents = require('../events/appEvents');

const router = express.Router();

// POST /api/notes - Create a new note
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const note = await Note.create({
      title,
      content,
      owner: req.user.id
    });

    appEvents.emit('noteCreated', note);

    return res.status(201).json(note);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/notes - Get all notes of logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ owner: req.user.id });
    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/notes/admin/all - RBAC protected route (admin only)
router.get('/admin/all', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const allNotes = await Note.find();
    return res.status(200).json(allNotes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/notes/:id - Get a single note by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    if (note.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    return res.status(200).json(note);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// PUT /api/notes/:id - Update a note by ID
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    if (note.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    const updatedNote = await note.save();

    return res.status(200).json(updatedNote);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// DELETE /api/notes/:id - Delete a note by ID
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    if (note.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await note.deleteOne();
    return res.status(200).json({ message: 'Note deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;