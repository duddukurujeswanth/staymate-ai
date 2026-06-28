import db from '../config/dbHelper.js';

export const createComplaint = async (req, res) => {
  const { title, description, category, priority, imageUrl } = req.body;
  try {
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description, and category are required' });
    }

    if (!req.user.roomId) {
      return res.status(400).json({ message: 'You must be assigned to a room to raise complaints' });
    }

    const newComplaint = await db.create('Complaint', {
      tenantId: req.user.id,
      tenantName: req.user.name,
      roomNumber: req.user.roomNumber || 'N/A',
      pgId: req.user.pgId,
      title,
      description,
      category,
      priority: priority || 'Medium',
      status: 'Open',
      imageUrl: imageUrl || '',
      logs: [
        {
          status: 'Open',
          comment: 'Ticket opened by tenant.',
          date: new Date().toISOString()
        }
      ]
    });

    res.status(201).json(newComplaint);
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ message: 'Server error registering complaint' });
  }
};

export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await db.find('Complaint', { tenantId: req.user.id });
    res.json(complaints);
  } catch (error) {
    console.error('Get my complaints error:', error);
    res.status(500).json({ message: 'Server error retrieving your complaints' });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await db.find('Complaint');
    res.json(complaints);
  } catch (error) {
    console.error('Get all complaints error:', error);
    res.status(500).json({ message: 'Server error retrieving system complaints' });
  }
};

export const updateComplaintStatus = async (req, res) => {
  const { status, comment } = req.body;
  try {
    const complaint = await db.findById('Complaint', req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint ticket not found' });
    }

    const currentLogs = complaint.logs || [];
    const newLog = {
      status,
      comment: comment || `Status updated to ${status}.`,
      date: new Date().toISOString()
    };

    const updated = await db.findByIdAndUpdate('Complaint', req.params.id, {
      status,
      logs: [...currentLogs, newLog]
    });

    res.json(updated);
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({ message: 'Server error updating ticket status' });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const deleted = await db.findByIdAndDelete('Complaint', req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Complaint ticket not found' });
    }
    res.json({ message: 'Complaint deleted successfully', deleted });
  } catch (error) {
    console.error('Delete complaint error:', error);
    res.status(500).json({ message: 'Server error deleting complaint ticket' });
  }
};
