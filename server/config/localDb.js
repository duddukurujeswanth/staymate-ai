import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_DIR = path.join(__dirname, '..', 'local_db');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Generate random ID
const generateId = () => Math.random().toString(36).substring(2, 11);

// Standard seed data helper
const getSeedData = (collection) => {
  const hashedPassword = bcrypt.hashSync('password123', 10);
  switch (collection) {
    case 'users':
      return [
        {
          id: 'u1',
          name: 'Sarah Connor (Owner)',
          email: 'owner@staymate.ai',
          password: hashedPassword,
          role: 'owner',
          phone: '+91 9876543210',
          createdAt: new Date().toISOString()
        },
        {
          id: 'u2',
          name: 'Alex Mercer',
          email: 'tenant@staymate.ai',
          password: hashedPassword,
          role: 'tenant',
          phone: '+91 9988776655',
          pgId: 'pg1',
          roomId: 'r1',
          roomNumber: '101',
          sharingType: '1 Sharing',
          rentPaid: false,
          rentAmount: 10000,
          joiningDate: '2026-01-10T00:00:00.000Z',
          createdAt: new Date().toISOString()
        },
        {
          id: 'u3',
          name: 'Emma Watson',
          email: 'emma@gmail.com',
          password: hashedPassword,
          role: 'tenant',
          phone: '+91 9123456780',
          pgId: 'pg1',
          roomId: 'r2',
          roomNumber: '102',
          sharingType: '2 Sharing',
          rentPaid: true,
          rentAmount: 8000,
          joiningDate: '2026-02-15T00:00:00.000Z',
          createdAt: new Date().toISOString()
        }
      ];
    case 'pgs':
      return [
        {
          id: 'pg1',
          name: 'StayMate Elite Coliving',
          address: 'Jayanagar 4th Block, Bangalore, Near Metro Station',
          description: 'Premium smart living for professionals with high-end amenities, workspace, and a rooftop lounge.',
          amenities: ['WiFi', 'CCTV', 'Laundry', 'Housekeeping', 'Power Backup', 'Security', 'Food', 'Water Supply'],
          images: [
            '/assets/deluxe_private_suite.png',
            '/assets/twin_bed_sharing_room.jpg'
          ],
          createdAt: new Date().toISOString()
        },
        {
          id: 'pg2',
          name: 'StayMate Premium Suites',
          address: 'Koramangala 4th Block, Bangalore',
          description: 'Futuristic suites optimized for digital nomads. Features an open cafeteria, fitness studio, and super-fast internet.',
          amenities: ['WiFi', 'CCTV', 'Laundry', 'Housekeeping', 'Power Backup', 'Security', 'Food'],
          images: [
            '/assets/glassmorphic_workspace.jpg'
          ],
          createdAt: new Date().toISOString()
        }
      ];
    case 'rooms':
      return [
        {
          id: 'r1',
          pgId: 'pg1',
          roomNumber: '101',
          sharingType: '1 Sharing',
          rent: 10000,
          totalBeds: 1,
          occupiedBeds: 1,
          createdAt: new Date().toISOString()
        },
        {
          id: 'r2',
          pgId: 'pg1',
          roomNumber: '102',
          sharingType: '2 Sharing',
          rent: 8000,
          totalBeds: 2,
          occupiedBeds: 1,
          createdAt: new Date().toISOString()
        },
        {
          id: 'r3',
          pgId: 'pg1',
          roomNumber: '103',
          sharingType: '3 Sharing',
          rent: 7000,
          totalBeds: 3,
          occupiedBeds: 0,
          createdAt: new Date().toISOString()
        },
        {
          id: 'r4',
          pgId: 'pg2',
          roomNumber: '201',
          sharingType: '2 Sharing',
          rent: 9000,
          totalBeds: 2,
          occupiedBeds: 0,
          createdAt: new Date().toISOString()
        }
      ];
    case 'complaints':
      return [
        {
          id: 'c1',
          tenantId: 'u2',
          tenantName: 'Alex Mercer',
          roomNumber: '101',
          pgId: 'pg1',
          title: 'WiFi speed is dropping frequently',
          description: 'The router on the 1st floor drops connectivity during office hours. Video calls keep buffering.',
          category: 'WiFi',
          priority: 'High',
          status: 'In Progress',
          imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=70',
          logs: [
            { status: 'Open', date: new Date(Date.now() - 86400000).toISOString(), comment: 'Complaint submitted' },
            { status: 'In Progress', date: new Date().toISOString(), comment: 'Technician scheduled for 4 PM visit' }
          ],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'c2',
          tenantId: 'u3',
          tenantName: 'Emma Watson',
          roomNumber: '102',
          pgId: 'pg1',
          title: 'Water tap leaking in washroom',
          description: 'The bathroom basin tap is constantly dripping water. Needs washer replacement.',
          category: 'Water',
          priority: 'Medium',
          status: 'Resolved',
          imageUrl: '',
          logs: [
            { status: 'Open', date: new Date(Date.now() - 172800000).toISOString(), comment: 'Complaint submitted' },
            { status: 'In Progress', date: new Date(Date.now() - 86400000).toISOString(), comment: 'Plumber assigned' },
            { status: 'Resolved', date: new Date().toISOString(), comment: 'Tap washer replaced. Leak fixed.' }
          ],
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    case 'joinRequests':
      return [
        {
          id: 'jr1',
          name: 'John Doe',
          phone: '+91 9888123456',
          email: 'johndoe@gmail.com',
          occupation: 'Software Engineer',
          gender: 'Male',
          preferredSharing: '2 Sharing',
          preferredMoveInDate: '2026-07-05',
          message: 'Hi, I work at Google and am looking for a premium place with WiFi and a workspace.',
          status: 'Pending',
          createdAt: new Date().toISOString()
        }
      ];
    case 'announcements':
      return [
        {
          id: 'a1',
          title: 'Water Tank Cleaning Scheduled',
          content: 'The overhead water tanks for StayMate Elite will be cleaned tomorrow Sunday between 10:00 AM and 02:00 PM. Please store sufficient water.',
          category: 'Maintenance',
          createdAt: new Date(Date.now() - 12 * 3600000).toISOString()
        },
        {
          id: 'a2',
          title: 'WiFi Router Upgrade',
          content: 'We are upgrading the main broadband line on the rooftop to 1 Gbps today midnight. Expect a 10-minute network downtime.',
          category: 'Internet',
          createdAt: new Date(Date.now() - 36 * 3600000).toISOString()
        }
      ];
    default:
      return [];
  }
};

class LocalDb {
  constructor() {
    this.cache = {};
  }

  filePath(collection) {
    return path.join(DB_DIR, `${collection}.json`);
  }

  read(collection) {
    if (this.cache[collection]) return this.cache[collection];

    const file = this.filePath(collection);
    if (!fs.existsSync(file)) {
      const seed = getSeedData(collection);
      fs.writeFileSync(file, JSON.stringify(seed, null, 2), 'utf-8');
      this.cache[collection] = seed;
      return seed;
    }

    try {
      const data = fs.readFileSync(file, 'utf-8');
      const parsed = JSON.parse(data);
      this.cache[collection] = parsed;
      return parsed;
    } catch (e) {
      console.error(`Error reading collection ${collection}:`, e);
      return [];
    }
  }

  write(collection, data) {
    this.cache[collection] = data;
    const file = this.filePath(collection);
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  }

  async find(collection, query = {}) {
    const data = this.read(collection);
    return data.filter(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  }

  async findOne(collection, query = {}) {
    const data = this.read(collection);
    return data.find(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    }) || null;
  }

  async create(collection, doc) {
    const data = this.read(collection);
    const newDoc = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    data.push(newDoc);
    this.write(collection, data);
    return newDoc;
  }

  async findByIdAndUpdate(collection, id, updates) {
    const data = this.read(collection);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return null;

    const updatedDoc = {
      ...data[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    data[index] = updatedDoc;
    this.write(collection, data);
    return updatedDoc;
  }

  async findByIdAndDelete(collection, id) {
    const data = this.read(collection);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return null;

    const deleted = data.splice(index, 1)[0];
    this.write(collection, data);
    return deleted;
  }
}

export default new LocalDb();
