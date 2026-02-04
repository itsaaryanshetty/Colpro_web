import React, {useEffect, useState} from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation
} from "react-router-dom";
import Admindashboard from "./pages/Admindashboard";
import Adminprojects from "./pages/Adminprojects";
import Admintasks from "./pages/Admintasks";
import Login from "./pages/Login";
import Memberdashboard from "./pages/Memberdashboard";
import Taskdetails from "./pages/Taskdetails";
import Register from "./pages/Register";
import Notfound from "./pages/Notfound";
import Taskcard from "./components/Taskcard";
import About from "./pages/About";
import Header from "./components/Header";
import Home from "./pages/Home";
import Team from "./pages/Team";
import LogoutButton from "./pages/Logout";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import { authService} from "./services/authService";

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken();
      
      // No token at all
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Verify token is valid by calling backend
      try {
        await authService.getProtectedData();
        setIsAuthenticated(true);
      } catch (error) {
        // Token is invalid/expired
        console.error('Token validation failed:', error);
        authService.logout(); // Clear invalid token
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading while checking
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, show protected content
  return children;
};

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/team" element={<RequireAuth><Team /></RequireAuth>} />
          <Route path="/admin-dashboard" element={<RequireAuth><Admindashboard /></RequireAuth>} />
          <Route path="/admin-projects" element={<RequireAuth><Adminprojects /></RequireAuth>} />
          <Route path="/admin-tasks" element={<RequireAuth><Admintasks /></RequireAuth>} />
          <Route path="/member-tasks" element={<RequireAuth><Taskdetails /></RequireAuth>} />
          <Route path="/member-dashboard" element={<RequireAuth><Memberdashboard /></RequireAuth>} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/chat" element={<RequireAuth><Chat/></RequireAuth>} />
          <Route path="/logout" element={<LogoutButton />} />
          {/* Fallback */}
          <Route path="*" element={<Notfound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
