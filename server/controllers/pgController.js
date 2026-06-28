import db from '../config/dbHelper.js';

export const getAllPGs = async (req, res) => {
  try {
    const pgs = await db.find('PG');
    res.json(pgs);
  } catch (error) {
    console.error('Get PGs error:', error);
    res.status(500).json({ message: 'Server error retrieving PG properties' });
  }
};

export const getPGById = async (req, res) => {
  try {
    const pg = await db.findById('PG', req.params.id);
    if (!pg) {
      return res.status(404).json({ message: 'PG Property not found' });
    }
    res.json(pg);
  } catch (error) {
    console.error('Get PG by ID error:', error);
    res.status(500).json({ message: 'Server error retrieving PG details' });
  }
};

export const createPG = async (req, res) => {
  const { name, address, description, amenities, images } = req.body;
  try {
    if (!name || !address) {
      return res.status(400).json({ message: 'PG name and address are required' });
    }
    const newPg = await db.create('PG', {
      name,
      address,
      description: description || '',
      amenities: amenities || [],
      images: images || []
    });
    res.status(201).json(newPg);
  } catch (error) {
    console.error('Create PG error:', error);
    res.status(500).json({ message: 'Server error creating PG property' });
  }
};

export const updatePG = async (req, res) => {
  try {
    const updated = await db.findByIdAndUpdate('PG', req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'PG Property not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Update PG error:', error);
    res.status(500).json({ message: 'Server error updating PG details' });
  }
};

export const deletePG = async (req, res) => {
  try {
    const deleted = await db.findByIdAndDelete('PG', req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'PG Property not found' });
    }
    res.json({ message: 'PG Property deleted successfully', deleted });
  } catch (error) {
    console.error('Delete PG error:', error);
    res.status(500).json({ message: 'Server error deleting PG property' });
  }
};
