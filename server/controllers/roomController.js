import db from '../config/dbHelper.js';

export const getAllRooms = async (req, res) => {
  try {
    const { pgId } = req.query;
    const query = {};
    if (pgId) query.pgId = pgId;
    
    const rooms = await db.find('Room', query);
    res.json(rooms);
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Server error retrieving rooms list' });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await db.findById('Room', req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    console.error('Get room by ID error:', error);
    res.status(500).json({ message: 'Server error retrieving room details' });
  }
};

export const createRoom = async (req, res) => {
  const { pgId, roomNumber, sharingType, rent, totalBeds } = req.body;
  try {
    if (!pgId || !roomNumber || !sharingType || !rent || !totalBeds) {
      return res.status(400).json({ message: 'All room fields are required' });
    }
    
    const newRoom = await db.create('Room', {
      pgId,
      roomNumber,
      sharingType,
      rent: Number(rent),
      totalBeds: Number(totalBeds),
      occupiedBeds: 0
    });
    res.status(201).json(newRoom);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error creating room record' });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const updated = await db.findByIdAndUpdate('Room', req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ message: 'Server error updating room details' });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const deleted = await db.findByIdAndDelete('Room', req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully', deleted });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ message: 'Server error deleting room record' });
  }
};
