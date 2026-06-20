import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/client/HomePage.jsx';
import RoomListPage from './pages/client/RoomListPage.jsx';
import AdminPage from './pages/admin/AdminDashboard.jsx';
import StaffPage from './pages/GroomingStaff-form/staff.jsx';
import DogStayListingForm from './pages/owner-form/DogStayListingForm.jsx';
import DogStayDetailsPage from './pages/client/DogStayDetailsPage.jsx';
import DogStayBookingPage from './pages/client/DogStayBookingPage.jsx';
import UserProfilePage from './pages/client/UserProfilePage.jsx';
import ContactUsPage from './pages/client/ContactUsPage.jsx';
import ApprovedListingsPage from "./pages/admin/ApprovedListingsPage.jsx";
import GroomersPage from "./pages/admin/GroomersPage.jsx";
import GroomerDetailsPage from "./pages/admin/GroomerDetailsPage.jsx";
import ApprovedGroomersPage from "./pages/client/ApprovedGroomersPage.jsx";
import GroomerBookingPage from './pages/client/GroomerBookingPage.jsx';
import LoginScreen from './pages/client/LoginScreen.jsx';
import RoomBookingsPage from "./pages/admin/RoomBookingsPage.jsx";
import RoomBookingDetailsPage from "./pages/admin/RoomBookingDetailsPage.jsx";
import GrBookingPage from './pages/admin/GrBookingPage.jsx';
import GrBookingDetails from "./pages/admin/GrBookingDetails.jsx";
import ReviewsPage from './pages/client/ReviewsPage.jsx';
import RoomHosterDashboard from './pages/HosterDashboard/A-RoomHosterDashboard.jsx';
import HostLogin from './pages/HosterDashboard/HostLogin.jsx';

// ✅ NEW GROOMER DASHBOARD
import GroomerDashboard from "./pages/groomer-DashBoard/GroomerDashboard.jsx";

// ✅ STAFF EARNINGS PAGE (NEW)
import StaffEarningsPage from "./pages/grooming-staff/StaffEarningsPage.jsx";


// ✅ Legal Pages
import AboutUs from "./pages/client/AboutUs.jsx";
import Careers from "./pages/client/Careers.jsx";
import PrivacyPolicy from "./pages/client/PrivacyPolicy.jsx";
import TermsConditions from "./pages/client/TermsConditions.jsx";

function App() {
  return (
    <div className="App">
      <Routes>

        <Route path="/" element={<LoginScreen />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/rooms" element={<RoomListPage />} />
        <Route path="/details/:roomId" element={<DogStayDetailsPage />} />
        <Route path="/book/:id" element={<DogStayBookingPage />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/groomers" element={<GroomersPage />} />
        <Route path="/admin/groomers/:id" element={<GroomerDetailsPage />} />
        <Route path="/admin/Roombookings" element={<RoomBookingsPage />} />
        <Route path="/admin/Roombookings/:id" element={<RoomBookingDetailsPage />} />
        <Route path="/admin/GrBookingPage" element={<GrBookingPage />} />
        <Route path="/admin/groomer-booking/:id" element={<GrBookingDetails />} />

        {/* ✅ NEW ROUTE */}
        <Route path="/admin/groomer-dashboard" element={<GroomerDashboard />} />

        {/* STAFF / USER */}
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/approved-listings" element={<ApprovedListingsPage />} />
        <Route path="/groomers" element={<ApprovedGroomersPage />} />
        <Route path="/groomer-booking/:id" element={<GroomerBookingPage />} />
        <Route path="/reviews/:roomId" element={<ReviewsPage />} />
        <Route path="/HostDashboard" element={<RoomHosterDashboard />} />
        <Route path="/host-login" element={<HostLogin />} />

        {/*Grooming STAFF */}
<Route path="/staff" element={<StaffPage />} />

{/* ✅ NEW: STAFF EARNINGS PAGE */}
<Route path="/staff/earnings" element={<StaffEarningsPage />} />


        {/* LEGAL */}
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />

        <Route path="/owner/list-stay" element={<DogStayListingForm />} />
      </Routes>
    </div>
  );
}

export default App;
