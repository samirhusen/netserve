import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getErrorMessage } from '../api/axios';
import { Alert } from '../components/ui';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(
    searchParams.get('expired') ? 'Your session has expired. Please log in again.' : ''
  );
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await login(form.email, form.password);
      const fallback = data.role === 'ADMIN' ? '/admin' : '/dashboard';
      navigate(location.state?.from || fallback, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid email or password'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <div className="card-body p-4 p-md-5">
          <h2 className="fw-bold mb-1">Welcome back</h2>
          <p className="text-muted mb-4">Log in to manage your internet service.</p>

          <Alert message={error} onClose={() => setError('')} />

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className="form-control" value={form.email}
                     onChange={handleChange} required autoFocus />
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="password">Password</label>
              <input id="password" name="password" type="password" className="form-control" value={form.password}
                     onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
              {submitting ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="text-center text-muted mt-4 mb-0">
            New to NetServe? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
