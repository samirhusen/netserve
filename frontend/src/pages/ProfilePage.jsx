import { useEffect, useState } from 'react';
import api, { getErrorMessage, getFieldErrors } from '../api/axios';
import { useAuth } from '../context/useAuth';
import { Alert, Loading, PageHeader } from '../components/ui';

export default function ProfilePage() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ fullName: '', phone: '', address: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/api/users/me');
        setProfile(data);
        setForm({ fullName: data.fullName || '', phone: data.phone || '', address: data.address || '' });
      } catch (err) {
        setError(getErrorMessage(err, 'Could not load your profile'));
      }
    };
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});
    setSaving(true);
    try {
      const { data } = await api.put('/api/users/me', form);
      setProfile(data);
      updateUser(data);
      setSuccess('Your profile has been updated.');
    } catch (err) {
      setFieldErrors(getFieldErrors(err));
      setError(getErrorMessage(err, 'Could not update profile'));
    } finally {
      setSaving(false);
    }
  };

  if (!profile && !error) return <Loading text="Loading profile..." />;

  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      <PageHeader title="My profile" subtitle="Keep your contact details up to date." />

      <Alert type="success" message={success} onClose={() => setSuccess('')} />
      <Alert message={error} onClose={() => setError('')} />

      {profile && (
        <div className="card">
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="avatar">{profile.fullName.charAt(0).toUpperCase()}</div>
              <div>
                <div className="fw-bold fs-5">{profile.fullName}</div>
                <div className="text-muted small">{profile.email} · {profile.role === 'ADMIN' ? 'Administrator' : 'Customer'}</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label" htmlFor="fullName">Full name</label>
                <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange}
                       className={`form-control ${fieldErrors.fullName ? 'is-invalid' : ''}`} />
                {fieldErrors.fullName && <div className="invalid-feedback">{fieldErrors.fullName}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="email">Email</label>
                <input id="email" className="form-control" value={profile.email} disabled />
                <div className="form-text">Your email is used to log in and can't be changed.</div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="phone">Phone</label>
                  <input id="phone" name="phone" className="form-control" value={form.phone} onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="address">Address</label>
                  <input id="address" name="address" className="form-control" value={form.address} onChange={handleChange} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
