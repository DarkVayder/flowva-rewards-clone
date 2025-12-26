import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Rewards from './pages/Rewards';
import Redeem from './pages/Redeem';
import ProtectedRoute from './auth/ProtectedRoute';
import Sidebar from './components/Sidebar';
import AuthCallback from './auth/authCallback';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route
          path="/rewards"
          element={
            <ProtectedRoute>
              <Layout>
                <Rewards />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/redeem"
          element={
            <ProtectedRoute>
              <Layout>
                <Redeem />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </BrowserRouter>
  );
}
