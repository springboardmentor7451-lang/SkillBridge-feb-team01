import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import DashboardContent from './components/DashboardContent';
import CreateOpportunity from './pages/CreateOpportunity';
import ManageOpportunities from './pages/ManageOpportunities';
import BrowseOpportunities from './pages/BrowseOpportunities';
import OpportunityDetails from './pages/OpportunityDetails';
import EditOpportunity from './pages/EditOpportunity';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          
          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardContent />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Protected Opportunity Routes (Placeholders) */}
          <Route
            path="/opportunities/create"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CreateOpportunity />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/opportunities/manage"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ManageOpportunities />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/opportunities"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <BrowseOpportunities />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/opportunities/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <OpportunityDetails />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/opportunities/:id/edit"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <EditOpportunity />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Protected Profile Route (Placeholder) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
