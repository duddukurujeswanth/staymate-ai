import bcrypt from 'bcryptjs';
import db from '../config/dbHelper.js';

export const submitJoinRequest = async (req, res) => {
  const { name, phone, email, occupation, gender, preferredSharing, preferredMoveInDate, message } = req.body;
  try {
    if (!name || !phone || !email || !preferredSharing || !preferredMoveInDate) {
      return res.status(400).json({ message: 'Missing required visitor booking fields' });
    }

    const newRequest = await db.create('JoinRequest', {
      name,
      phone,
      email,
      occupation: occupation || '',
      gender: gender || 'Other',
      preferredSharing,
      preferredMoveInDate,
      message: message || '',
      status: 'Pending'
    });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Submit join request error:', error);
    res.status(500).json({ message: 'Server error processing booking inquiry' });
  }
};

export const getAllJoinRequests = async (req, res) => {
  try {
    const requests = await db.find('JoinRequest');
    res.json(requests);
  } catch (error) {
    console.error('Get all join requests error:', error);
    res.status(500).json({ message: 'Server error retrieving booking inquiries' });
  }
};

export const updateJoinRequestStatus = async (req, res) => {
  const { status, roomId } = req.body; // status: Approved, Rejected
  try {
    const request = await db.findById('JoinRequest', req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Join request not found' });
    }

    // Update status
    const updatedRequest = await db.findByIdAndUpdate('JoinRequest', req.params.id, { status });

    // If Approved, automatically generate a Tenant account
    if (status === 'Approved') {
      const emailExists = await db.findOne('User', { email: request.email });
      if (!emailExists) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        let roomDetails = { roomId: null, roomNumber: null, sharingType: null, rentAmount: 0, pgId: null };

        // If a room was selected for assignment on approval
        if (roomId) {
          const room = await db.findById('Room', roomId);
          if (room) {
            if (room.occupiedBeds < room.totalBeds) {
              roomDetails = {
                roomId: room.id,
                roomNumber: room.roomNumber,
                sharingType: room.sharingType,
                rentAmount: room.rent,
                pgId: room.pgId
              };
              // Increment bed count
              await db.findByIdAndUpdate('Room', room.id, { occupiedBeds: room.occupiedBeds + 1 });
            }
          }
        }

        await db.create('User', {
          name: request.name,
          email: request.email,
          password: hashedPassword,
          role: 'tenant',
          phone: request.phone,
          ...roomDetails,
          rentPaid: false,
          joiningDate: new Date().toISOString()
        });
      }
    }

    res.json({ message: `Join request successfully ${status.toLowerCase()}`, request: updatedRequest });
  } catch (error) {
    console.error('Update join request status error:', error);
    res.status(500).json({ message: 'Server error updating booking status' });
  }
};

export const deleteJoinRequest = async (req, res) => {
  try {
    const deleted = await db.findByIdAndDelete('JoinRequest', req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Join request not found' });
    }
    res.json({ message: 'Join request deleted successfully', deleted });
  } catch (error) {
    console.error('Delete join request error:', error);
    res.status(500).json({ message: 'Server error deleting booking request' });
  }
};
