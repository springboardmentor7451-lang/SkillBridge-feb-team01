import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import Organizations from './pages/Organizations';
import Opportunities from './pages/Opportunities';
import About from './pages/About';
import { AuthProvider } from './context/AuthContext';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import VolunteerDashboard from './pages/VolunteerDashboard';
import EditProfile from './pages/EditProfile';
import Applications from './pages/Applications';
import Chat from './pages/Chat';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<VolunteerDashboard />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
