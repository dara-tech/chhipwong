import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/layouts/MainLayout';
import LoginPage from './components/auth/loginPage';
import RegisterPage from './components/auth/RegisterPage';
import useAuth from './hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthProvider';
import { useThemeStore } from './store/useThemeStore';
import UserManagementPage from './components/admin/users/UserManagementPage';
import Profile from './components/admin/profile/layout';
import PaymentViewerPage from './pages/PaymentViewerPage';
import CompanyList from './components/admin/companies/CompanyList';
import CompanyEdit from './components/admin/companies/CompanyEdit';
import SettingPage from './components/shares/SettingPage';
import About from './components/clientPage/About';
import Mission from './components/clientPage/Mission';
import Vision from './components/clientPage/Vision';
import Contact from './components/clientPage/Contact';
import PolicyPrivacy from './components/clientPage/PolicyPrivacy';
import TermsAndConditions from './components/clientPage/TermsAndConditions';
import Home from './components/clientPage/Home';
import FaqPage from './components/clientPage/FaqPage';
import ProfessionalPage from './components/clientPage/ProfessionalPage';
import Chatbot from './components/chatbot/Chatbot';
import Navbar from './components/shares/Navbar';
import Footer from './components/shares/Footer';
import SuperAdminLayout from './components/admin/layouts/SuperAdminLayout';
import SuperAdminDashboard from './components/admin/dashboard/SuperAdminDashboard';
import EditUserPage from './components/admin/users/EditUserPage';
import { routesMetadata } from './config/metadata';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const PrivateRoute = ({ children, roles }) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(profile.type)) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  const { isAuthenticated, profile } = useAuth();
  const { theme } = useThemeStore();
  const isSuperAdmin = profile?.type === 'super_admin';

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" />
        <div data-theme={theme}>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                <>
                  {!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />}
                </>
              } 
            />
            <Route 
              path="/register" 
              element={
                <>
                  {!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />}
                </>
              } 
            />
            <Route 
              path="/about" 
              element={
                <>
                  <About />
                </>
              } 
            />
            <Route 
              path="/mission" 
              element={
                <>
                  <Mission />
                </>
              } 
            />
            <Route 
              path="/vision" 
              element={
                <>
                  <Vision />
                </>
              } 
            />
            <Route 
              path="/contact" 
              element={
                <>
                  <Contact />
                </>
              } 
            />
            <Route 
              path="/privacy-policy" 
              element={
                <>
                  <PolicyPrivacy />
                </>
              } 
            />
            <Route 
              path="/terms-conditions" 
              element={
                <>
                  <TermsAndConditions />
                </>
              } 
            />
            <Route 
              path="/faq" 
              element={
                <>
                  <FaqPage />
                </>
              } 
            />
            <Route 
              path="/setting" 
              element={
                <>
                  <SettingPage />
                </>
              } 
            />
            <Route 
              path="/professional" 
              element={
                <>
                  <ProfessionalPage />
                </>
              } 
            />

            {/* Protected Routes */}
            <Route element={<PrivateRoute roles={['super_admin', 'admin']}><MainLayout /></PrivateRoute>}>
              <Route path="/dashboard" element={<SuperAdminDashboard />} />
              <Route path="/companies" element={<CompanyList />} />
              <Route path="/companies/:id" element={<CompanyEdit />} />
              <Route path="/users" element={<UserManagementPage />} />
              <Route path="/users/:id" element={<EditUserPage />} />
              <Route path="/admin/settings" element={<SettingPage />} />
            </Route>

            {/* Payment Viewer Route - accessible to super_admin, admin, and payment_viewer */}
            <Route path="/payments" element={
              <PrivateRoute roles={['super_admin', 'admin', 'payment_viewer']}>
                <PaymentViewerPage />
              </PrivateRoute>
            } />
            {/* Profile Route - accessible to super_admin, admin, and payment_viewer */}
            <Route path="/profile" element={
              <PrivateRoute roles={['super_admin', 'admin', 'payment_viewer']}>
                <Profile />
              </PrivateRoute>
            } />

            {/* Root Route - Conditional rendering based on authentication */}
            <Route 
              path="/" 
              element={
                isSuperAdmin ? (
                  <PrivateRoute roles={['super_admin']}>
                    <SuperAdminLayout />
                  </PrivateRoute>
                ) : (
                  <>
                    <Home />
                  </>
                )
              }
            >
              {isSuperAdmin && (
                <>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<SuperAdminDashboard />} />
                </>
              )}
            </Route>

            {/* 404 Route */}
            <Route 
              path="*" 
              element={
                <>
                  <Navigate to="/" />
                </>
              } 
            />
          </Routes>
          {/* Only show Footer if not super admin */}
          {!isSuperAdmin && <Footer />}
          <Chatbot />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;