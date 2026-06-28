import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import * as auth from '../controllers/authController.js';
import * as pgs from '../controllers/pgController.js';
import * as rooms from '../controllers/roomController.js';
import * as tenants from '../controllers/tenantController.js';
import * as complaints from '../controllers/complaintController.js';
import * as joinRequests from '../controllers/joinRequestController.js';
import * as announcements from '../controllers/announcementController.js';

const router = express.Router();

// ==================== AUTH ROUTES ====================
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.get('/auth/profile', protect, auth.getProfile);
router.put('/auth/profile', protect, auth.updateProfile);
router.post('/auth/forgot-password', auth.forgotPassword);

// ==================== PG PROPERTY ROUTES ====================
router.get('/pgs', pgs.getAllPGs);
router.get('/pgs/:id', pgs.getPGById);
router.post('/pgs', protect, authorize('owner'), pgs.createPG);
router.put('/pgs/:id', protect, authorize('owner'), pgs.updatePG);
router.delete('/pgs/:id', protect, authorize('owner'), pgs.deletePG);

// ==================== ROOM ROUTES ====================
router.get('/rooms', rooms.getAllRooms);
router.get('/rooms/:id', rooms.getRoomById);
router.post('/rooms', protect, authorize('owner'), rooms.createRoom);
router.put('/rooms/:id', protect, authorize('owner'), rooms.updateRoom);
router.delete('/rooms/:id', protect, authorize('owner'), rooms.deleteRoom);

// ==================== TENANT MANAGEMENT ROUTES ====================
router.get('/tenants', protect, authorize('owner'), tenants.getAllTenants);
router.post('/tenants', protect, authorize('owner'), tenants.createTenant);
router.put('/tenants/:id', protect, authorize('owner'), tenants.updateTenant);
router.delete('/tenants/:id', protect, authorize('owner'), tenants.removeTenant);
router.post('/tenants/transfer', protect, authorize('owner'), tenants.transferTenantRoom);

// ==================== COMPLAINT MANAGEMENT ROUTES ====================
router.post('/complaints', protect, complaints.createComplaint);
router.get('/complaints/my', protect, authorize('tenant'), complaints.getMyComplaints);
router.get('/complaints', protect, authorize('owner'), complaints.getAllComplaints);
router.put('/complaints/:id/status', protect, complaints.updateComplaintStatus);
router.delete('/complaints/:id', protect, complaints.deleteComplaint);

// ==================== JOIN REQUESTS ROUTES ====================
router.post('/join-requests', joinRequests.submitJoinRequest);
router.get('/join-requests', protect, authorize('owner'), joinRequests.getAllJoinRequests);
router.put('/join-requests/:id/status', protect, authorize('owner'), joinRequests.updateJoinRequestStatus);
router.delete('/join-requests/:id', protect, authorize('owner'), joinRequests.deleteJoinRequest);

// ==================== ANNOUNCEMENTS ROUTES ====================
router.get('/announcements', announcements.getAllAnnouncements);
router.post('/announcements', protect, authorize('owner'), announcements.createAnnouncement);
router.delete('/announcements/:id', protect, authorize('owner'), announcements.deleteAnnouncement);

export default router;
