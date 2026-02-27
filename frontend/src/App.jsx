import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';

// Public layout components
import Navbar from './components/Navbar';
import { Layout } from 'antd';

// Auth layout for dashboard
import AuthLayout from './components/AuthLayout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Organizations from './pages/Organizations';
import Opportunities from './pages/Opportunities';
import About from './pages/About';
import Profile from './pages/Profile';
import NGOProfileForm from './pages/NGOProfileForm';
import ManageOpportunities from './pages/ManageOpportunities';

// Ant Design global theme
const antdTheme = {
  token: {
    colorPrimary: '#0f6fff',
    colorLink: '#0f6fff',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    borderRadius: 10,
    borderRadiusLG: 14,
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
    colorBgContainer: '#ffffff',
    colorBorder: '#e2e8f0',
    colorText: '#1e293b',
    colorTextSecondary: '#64748b',
  },
  components: {
    Button: { borderRadius: 8, fontWeight: 600, controlHeight: 40, paddingInline: 20 },
    Card: { borderRadiusLG: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' },
    Table: { borderRadiusLG: 12, headerBg: '#f8fafc', headerColor: '#475569', headerFontSize: 12 },
    Input: { borderRadius: 8, controlHeight: 42 },
    Select: { borderRadius: 8, controlHeight: 42 },
    Tag: { borderRadius: 20, fontWeight: 500 },
    Modal: { borderRadiusLG: 16 },
    Menu: { activeBarBorderWidth: 0 },
    Badge: { borderRadius: 10 },
  },
};

// Public layout wrapper (with Navbar)
const PublicRoute = ({ children }) => (
  <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
    <Navbar />
    <Layout.Content>{children}</Layout.Content>
  </Layout>
);

// Redirect logged-in users from landing page
const LandingRoute = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (user) {
    return <Navigate to={user.role === 'ngo' ? '/manage-opportunities' : '/opportunities'} replace />;
  }
  return (
    <PublicRoute>
      <LandingPage />
    </PublicRoute>
  );
};

// Protected route with auth sidebar layout
const DashboardRoute = ({ children, allowedRoles, pageTitle }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return (
    <AuthLayout pageTitle={pageTitle}>
      {children}
    </AuthLayout>
  );
};

// Smart Opportunities route that switches layout based on auth
const SmartOpportunityRoute = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;

  if (user) {
    return (
      <DashboardRoute pageTitle="Explore Opportunities">
        <Opportunities />
      </DashboardRoute>
    );
  }

  return (
    <PublicRoute>
      <Opportunities />
    </PublicRoute>
  );
};

function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingRoute />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/organizations" element={<PublicRoute><Organizations /></PublicRoute>} />
            <Route path="/opportunities" element={<SmartOpportunityRoute />} />
            <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />

            {/* Dashboard routes */}
            <Route
              path="/profile"
              element={
                <DashboardRoute pageTitle="My Profile">
                  <Profile />
                </DashboardRoute>
              }
            />
            <Route
              path="/ngo-profile"
              element={
                <DashboardRoute allowedRoles={['ngo']} pageTitle="NGO Profile">
                  <NGOProfileForm />
                </DashboardRoute>
              }
            />
            <Route
              path="/manage-opportunities"
              element={
                <DashboardRoute allowedRoles={['ngo']} pageTitle="Manage Opportunities">
                  <ManageOpportunities />
                </DashboardRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;