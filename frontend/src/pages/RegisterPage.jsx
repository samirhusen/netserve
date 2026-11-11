import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getErrorMessage, getFieldErrors } from '../api/axios';
import { Alert } from '../components/ui';

const EMPTY_FORM = { fullName: '', email: '', password: '', confirmPassword: '', phone: '', address: '' };

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = 'Full name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      const { confirmPassword: _ignored, ...payload } = form;
      await register(payload);
      navigate('/plans', { replace: true, state: { welcome: true } });
    } catch (err) {
      setFieldErrors(getFieldErrors(err));
      setError(getErrorMessage(err, 'Registration failed'));
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name, label, type = 'text', extra = {}) => (
    <div className="mb-3">
      <label className="form-label" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} value={form[name]} onChange={handleChange}
             className={`form-control ${fieldErrors[name] ? 'is-invalid' : ''}`} {...extra} />
      {fieldErrors[name] && <div className="invalid-feedback">{fieldErrors[name]}</div>}
    </div>
  );

  return (
    <div className="auth-wrapper">
      <div className="card auth-card auth-card-wide">
        <div className="card-body p-4 p-md-5">
          <h2 className="fw-bold mb-1">Create your account</h2>
          <p className="text-muted mb-4">Join NetServe and get connected in minutes.</p>

          <Alert message={error} onClose={() => setError('')} />

          <form onSubmit={handleSubmit} noValidate>
            {field('fullName', 'Full name', 'text', { autoFocus: true })}
            {field('email', 'Email', 'email')}
            <div className="row">
              <div className="col-md-6">{field('password', 'Password', 'password')}</div>
              <div className="col-md-6">{field('confirmPassword', 'Confirm password', 'password')}</div>
            </div>
            <div className="row">
              <div className="col-md-6">{field('phone', 'Phone (optional)', 'tel')}</div>
              <div className="col-md-6">{field('address', 'Address (optional)')}</div>
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-2" disabled={submitting}>
              {submitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-muted mt-4 mb-0">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
