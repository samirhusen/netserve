import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { GuestRoute, ProtectedRoute } from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PlansPage from './pages/PlansPage';
import DashboardPage from './pages/DashboardPage';
import BillsPage from './pages/BillsPage';
import TicketsPage from './pages/TicketsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPlansPage from './pages/admin/AdminPlansPage';
import AdminTicketsPage from './pages/admin/AdminTicketsPage';
import AdminSubscriptionsPage from './pages/admin/AdminSubscriptionsPage';
import AdminBillsPage from './pages/admin/AdminBillsPage';

const customer = (page) => <ProtectedRoute role="CUSTOMER">{page}</ProtectedRoute>;
const YEAR = new Date().getFullYear();
const admin = (page) => <ProtectedRoute role="ADMIN">{page}</ProtectedRoute>;

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

          {/* Customer */}
          <Route path="/dashboard" element={customer(<DashboardPage />)} />
          <Route path="/bills" element={customer(<BillsPage />)} />
          <Route path="/tickets" element={customer(<TicketsPage />)} />

          {/* Any logged in user */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={admin(<AdminDashboardPage />)} />
          <Route path="/admin/plans" element={admin(<AdminPlansPage />)} />
          <Route path="/admin/tickets" element={admin(<AdminTicketsPage />)} />
          <Route path="/admin/subscriptions" element={admin(<AdminSubscriptionsPage />)} />
          <Route path="/admin/bills" element={admin(<AdminBillsPage />)} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="app-footer text-center small text-muted py-3">
        © {YEAR} NetServe · Broadband Subscriber and Service Management Portal
      </footer>
    </div>
  );
}
