import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.js';

// Layout & Guards
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Visitor Pages
import LandingPage from './pages/LandingPage.jsx';
import Rooms from './pages/Rooms.jsx';
import Amenities from './pages/Amenities.jsx';
import Gallery from './pages/Gallery.jsx';
import JoinRequest from './pages/JoinRequest.jsx';
import Login from './pages/Login.jsx';
import AIChatbot from './components/AIChatbot.jsx';

// Tenant Dashboards
import TenantLayout from './pages/TenantDashboard/TenantLayout.jsx';
import TenantDashboard from './pages/TenantDashboard/TenantDashboard.jsx';
import RaiseComplaint from './pages/TenantDashboard/RaiseComplaint.jsx';
import MyComplaints from './pages/TenantDashboard/MyComplaints.jsx';
import TenantAnnouncements from './pages/TenantDashboard/TenantAnnouncements.jsx';
import TenantProfile from './pages/TenantDashboard/TenantProfile.jsx';

// Owner Dashboards
import OwnerLayout from './pages/OwnerDashboard/OwnerLayout.jsx';
import OwnerOverview from './pages/OwnerDashboard/OwnerOverview.jsx';
import PropertyManager from './pages/OwnerDashboard/PropertyManager.jsx';
import RoomManager from './pages/OwnerDashboard/RoomManager.jsx';
import TenantManager from './pages/OwnerDashboard/TenantManager.jsx';
import ComplaintManager from './pages/OwnerDashboard/ComplaintManager.jsx';
import JoinRequestsManager from './pages/OwnerDashboard/JoinRequestsManager.jsx';
import AnnouncementsManager from './pages/OwnerDashboard/AnnouncementsManager.jsx';
import ReportsManager from './pages/OwnerDashboard/ReportsManager.jsx';

// Visitor Layout wrapper to include Navbar and Footer
const VisitorLayout = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <div className="flex-1 bg-brand-dark">
        <Outlet />
      </div>
      <Footer />
      <AIChatbot />
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          
          {/* Public Visitor Routes */}
          <Route element={<VisitorLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/amenities" element={<Amenities />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/join" element={<JoinRequest />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected Tenant Routes */}
          <Route 
            path="/tenant" 
            element={
              <ProtectedRoute allowedRoles={['tenant']}>
                <TenantLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TenantDashboard />} />
            <Route path="raise-complaint" element={<RaiseComplaint />} />
            <Route path="my-complaints" element={<MyComplaints />} />
            <Route path="announcements" element={<TenantAnnouncements />} />
            <Route path="profile" element={<TenantProfile />} />
          </Route>

          {/* Protected Owner Routes */}
          <Route 
            path="/owner" 
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<OwnerOverview />} />
            <Route path="properties" element={<PropertyManager />} />
            <Route path="rooms" element={<RoomManager />} />
            <Route path="tenants" element={<TenantManager />} />
            <Route path="complaints" element={<ComplaintManager />} />
            <Route path="join-requests" element={<JoinRequestsManager />} />
            <Route path="announcements" element={<AnnouncementsManager />} />
            <Route path="reports" element={<ReportsManager />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
