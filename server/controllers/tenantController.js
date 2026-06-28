import bcrypt from 'bcryptjs';
import db from '../config/dbHelper.js';

export const getAllTenants = async (req, res) => {
  try {
    const tenants = await db.find('User', { role: 'tenant' });
    // Remove passwords
    const sanitized = tenants.map(t => {
      const copy = { ...t };
      delete copy.password;
      return copy;
    });
    res.json(sanitized);
  } catch (error) {
    console.error('Get tenants error:', error);
    res.status(500).json({ message: 'Server error retrieving tenants list' });
  }
};

export const createTenant = async (req, res) => {
  const { name, email, password, phone, pgId, roomId } = req.body;
  try {
    const exists = await db.findOne('User', { email });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password || 'password123', 10);
    
    let roomDetails = { roomId: null, roomNumber: null, sharingType: null, rentAmount: 0 };
    if (roomId) {
      const room = await db.findById('Room', roomId);
      if (room) {
        if (room.occupiedBeds >= room.totalBeds) {
          return res.status(400).json({ message: 'Selected room is already fully occupied' });
        }
        roomDetails = {
          roomId: room.id,
          roomNumber: room.roomNumber,
          sharingType: room.sharingType,
          rentAmount: room.rent
        };
        // Update occupied beds
        await db.findByIdAndUpdate('Room', room.id, { occupiedBeds: room.occupiedBeds + 1 });
      }
    }

    const newTenant = await db.create('User', {
      name,
      email,
      password: hashedPassword,
      role: 'tenant',
      phone: phone || '',
      pgId: pgId || null,
      ...roomDetails,
      rentPaid: false,
      joiningDate: new Date().toISOString()
    });

    const result = { ...newTenant };
    delete result.password;
    res.status(201).json(result);
  } catch (error) {
    console.error('Create tenant error:', error);
    res.status(500).json({ message: 'Server error creating tenant record' });
  }
};

export const updateTenant = async (req, res) => {
  try {
    const { name, email, phone, rentPaid } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    if (rentPaid !== undefined) updates.rentPaid = rentPaid;

    const updated = await db.findByIdAndUpdate('User', req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    
    delete updated.password;
    res.json(updated);
  } catch (error) {
    console.error('Update tenant error:', error);
    res.status(500).json({ message: 'Server error updating tenant details' });
  }
};

export const removeTenant = async (req, res) => {
  try {
    const tenant = await db.findById('User', req.params.id);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    // Decrement occupied bed count in room if assigned
    if (tenant.roomId) {
      const room = await db.findById('Room', tenant.roomId);
      if (room && room.occupiedBeds > 0) {
        await db.findByIdAndUpdate('Room', room.id, { occupiedBeds: Math.max(0, room.occupiedBeds - 1) });
      }
    }

    await db.findByIdAndDelete('User', req.params.id);
    res.json({ message: 'Tenant removed successfully', id: req.params.id });
  } catch (error) {
    console.error('Remove tenant error:', error);
    res.status(500).json({ message: 'Server error removing tenant record' });
  }
};

export const transferTenantRoom = async (req, res) => {
  const { tenantId, targetRoomId } = req.body;
  try {
    const tenant = await db.findById('User', tenantId);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const targetRoom = await db.findById('Room', targetRoomId);
    if (!targetRoom) {
      return res.status(404).json({ message: 'Target room not found' });
    }

    if (targetRoom.occupiedBeds >= targetRoom.totalBeds) {
      return res.status(400).json({ message: 'Target room is fully occupied' });
    }

    // 1. Release bed in old room
    if (tenant.roomId) {
      const oldRoom = await db.findById('Room', tenant.roomId);
      if (oldRoom && oldRoom.occupiedBeds > 0) {
        await db.findByIdAndUpdate('Room', oldRoom.id, { occupiedBeds: oldRoom.occupiedBeds - 1 });
      }
    }

    // 2. Claim bed in new room
    await db.findByIdAndUpdate('Room', targetRoom.id, { occupiedBeds: targetRoom.occupiedBeds + 1 });

    // 3. Update tenant profile
    const updatedTenant = await db.findByIdAndUpdate('User', tenantId, {
      roomId: targetRoom.id,
      roomNumber: targetRoom.roomNumber,
      sharingType: targetRoom.sharingType,
      rentAmount: targetRoom.rent,
      pgId: targetRoom.pgId
    });

    delete updatedTenant.password;
    res.json({
      message: 'Room transferred successfully',
      tenant: updatedTenant
    });
  } catch (error) {
    console.error('Transfer room error:', error);
    res.status(500).json({ message: 'Server error transferring room assignment' });
  }
};
