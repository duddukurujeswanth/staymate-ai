import db from '../config/dbHelper.js';

export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await db.find('Announcement');
    // Sort announcements by creation date descending
    const sorted = announcements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sorted);
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ message: 'Server error retrieving announcements list' });
  }
};

export const createAnnouncement = async (req, res) => {
  const { title, content, category } = req.body;
  try {
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    const newAnnouncement = await db.create('Announcement', {
      title,
      content,
      category: category || 'General'
    });
    res.status(201).json(newAnnouncement);
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Server error creating announcement broadcast' });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const deleted = await db.findByIdAndDelete('Announcement', req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json({ message: 'Announcement deleted successfully', deleted });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ message: 'Server error deleting announcement' });
  }
};
