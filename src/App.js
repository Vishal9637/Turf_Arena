import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* Public Pages */
import Home from "./Pages/Home";
import TurfList from "./Pages/TurfList";
import TurfDetails from "./Pages/TurfDetails";
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";

/* User Pages */
import Profile from "./Pages/user/Profile";
import TurfBooking from "./Pages/user/TurfBooking";
import BookingConfirmation from "./Pages/user/BookingConfirmation";

/* Owner Pages */
import OwnerDashboard from "./Pages/owner/OwnerDashboard";
import AddTurf from "./Pages/owner/AddTurf";
import MyTurfs from "./Pages/owner/MyTurfs";
import OwnerBookings from "./Pages/owner/OwnerBookings";

/* Route Guard */
import ProtectedRoute from "./routes/ProtectedRoute";

/* 404 Page */
const NotFound = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
    <h1 className="text-4xl font-bold text-green-600 mb-2">
      404
    </h1>
    <p className="text-gray-500">
      Page not found
    </p>
  </div>
);

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* 🌍 PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/turfs" element={<TurfList />} />
        <Route path="/turfs/:id" element={<TurfDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 👤 USER ROUTES */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking/:turfId"
          element={
            <ProtectedRoute>
              <TurfBooking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking-confirmation"
          element={
            <ProtectedRoute>
              <BookingConfirmation />
            </ProtectedRoute>
          }
        />

        {/* 🔐 OWNER ROUTES */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/add-turf"
          element={
            <ProtectedRoute allowedRole="owner">
              <AddTurf />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/my-turfs"
          element={
            <ProtectedRoute allowedRole="owner">
              <MyTurfs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/bookings"
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerBookings />
            </ProtectedRoute>
          }
        />

        {/* ❌ 404 FALLBACK */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
