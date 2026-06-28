import mongoose from 'mongoose';
import localDb from './localDb.js';
import User from '../models/User.js';
import PG from '../models/PG.js';
import Room from '../models/Room.js';
import Complaint from '../models/Complaint.js';
import JoinRequest from '../models/JoinRequest.js';
import Announcement from '../models/Announcement.js';

const models = {
  User,
  PG,
  Room,
  Complaint,
  JoinRequest,
  Announcement
};

const isLocal = () => !process.env.MONGODB_URI;

const normalizeId = (doc) => {
  if (!doc) return null;
  if (Array.isArray(doc)) return doc.map(normalizeId);
  
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  if (obj._id) {
    obj.id = obj._id.toString();
  }
  return obj;
};

const db = {
  async find(modelName, query = {}) {
    if (isLocal()) {
      return localDb.find(modelName.toLowerCase() + 's', query);
    }
    
    // In Mongoose, handle queries by standard field name mapping
    const mongooseQuery = { ...query };
    if (mongooseQuery.id) {
      mongooseQuery._id = mongooseQuery.id;
      delete mongooseQuery.id;
    }
    const results = await models[modelName].find(mongooseQuery).lean();
    return normalizeId(results);
  },

  async findOne(modelName, query = {}) {
    if (isLocal()) {
      return localDb.findOne(modelName.toLowerCase() + 's', query);
    }

    const mongooseQuery = { ...query };
    if (mongooseQuery.id) {
      mongooseQuery._id = mongooseQuery.id;
      delete mongooseQuery.id;
    }
    const result = await models[modelName].findOne(mongooseQuery).lean();
    return normalizeId(result);
  },

  async findById(modelName, id) {
    if (isLocal()) {
      return localDb.findOne(modelName.toLowerCase() + 's', { id });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const result = await models[modelName].findById(id).lean();
    return normalizeId(result);
  },

  async create(modelName, data) {
    if (isLocal()) {
      return localDb.create(modelName.toLowerCase() + 's', data);
    }
    const newDoc = await models[modelName].create(data);
    return normalizeId(newDoc);
  },

  async findByIdAndUpdate(modelName, id, updates) {
    if (isLocal()) {
      return localDb.findByIdAndUpdate(modelName.toLowerCase() + 's', id, updates);
    }
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const updated = await models[modelName].findByIdAndUpdate(id, updates, { new: true }).lean();
    return normalizeId(updated);
  },

  async findByIdAndDelete(modelName, id) {
    if (isLocal()) {
      return localDb.findByIdAndDelete(modelName.toLowerCase() + 's', id);
    }
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const deleted = await models[modelName].findByIdAndDelete(id).lean();
    return normalizeId(deleted);
  }
};

export default db;
