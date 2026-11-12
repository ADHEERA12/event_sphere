import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgetPassword";
import Events from "./pages/Event";
import EventDetails from "./pages/EventDetails";
import Recommendations from "./pages/Recommendations";
import NotFound from "./pages/NotFound";

// User Protected Pages
import UserDashboard from "./pages/UserDashboard";
import RegisterEvent from "./pages/RegisterEvent";
import Payment from "./pages/Payment";
import MyRegistrations from "./pages/MyRegistrations";
import Profile from "./pages/Profile";

// Admin Protected Pages
import AdminDashboard from "./pages/AdminDashboard";
import CreateEvent from "./pages/CreateEvent";
import ManageEvents from "./pages/ManageEvents";
import ManageUsers from "./pages/ManageUsers";
import AdminRegistrations from "./pages/AdminRegistrations";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/recommendations" element={<Recommendations />} />

          {/* User Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register-event/:id"
            element={
              <ProtectedRoute>
                <RegisterEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:id"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-registrations"
            element={
              <ProtectedRoute>
                <MyRegistrations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-event"
            element={
              <ProtectedRoute adminOnly>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-events"
            element={
              <ProtectedRoute adminOnly>
                <ManageEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/registrations"
            element={
              <ProtectedRoute adminOnly>
                <AdminRegistrations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-users"
            element={
              <ProtectedRoute adminOnly>
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
