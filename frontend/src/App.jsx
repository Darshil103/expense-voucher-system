import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import EmployeeDashboard from './pages/employee/Dashboard';
import VoucherForm from './pages/employee/VoucherForm';
import MyVouchers from './pages/employee/MyVouchers';

import DirectorDashboard from './pages/director/Dashboard';
import PendingApprovals from './pages/director/PendingApprovals';
import DirectorAllVouchers from './pages/director/AllVouchers';

import AccountsDashboard from './pages/accounts/Dashboard';
import AccountsAllVouchers from './pages/accounts/AllVouchers';

import VoucherDetails from './pages/VoucherDetails';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Employee Routes */}
          <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
            <Route element={<Layout />}>
              <Route path="/employee" element={<EmployeeDashboard />} />
              <Route path="/employee/create" element={<VoucherForm />} />
              <Route path="/employee/vouchers" element={<MyVouchers />} />
              <Route path="/employee/vouchers/:id" element={<VoucherDetails />} />
              <Route path="/employee/vouchers/:id/edit" element={<VoucherForm />} />
            </Route>
          </Route>

          {/* Protected Director Routes */}
          <Route element={<ProtectedRoute allowedRoles={['director']} />}>
            <Route element={<Layout />}>
              <Route path="/director" element={<DirectorDashboard />} />
              <Route path="/director/pending" element={<PendingApprovals />} />
              <Route path="/director/vouchers" element={<DirectorAllVouchers />} />
              <Route path="/director/vouchers/:id" element={<VoucherDetails />} />
            </Route>
          </Route>

          {/* Protected Accounts Routes */}
          <Route element={<ProtectedRoute allowedRoles={['accounts']} />}>
            <Route element={<Layout />}>
              <Route path="/accounts" element={<AccountsDashboard />} />
              <Route path="/accounts/vouchers" element={<AccountsAllVouchers />} />
              <Route path="/accounts/vouchers/:id" element={<VoucherDetails />} />
            </Route>
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
