import { useEffect, useState } from 'react';
import api, { getErrorMessage, getFieldErrors } from '../../api/axios';
import { Alert, EmptyState, Loading, PageHeader } from '../../components/ui';
import { formatData, formatMoney, formatSpeed } from '../../utils/format';

const EMPTY_FORM = { name: '', speedMbps: '', dataLimitGb: '', price: '', validityDays: '30', description: '' };

export default function AdminPlansPage() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadPlans = async () => {
    try {
      const { data } = await api.get('/api/admin/plans');
      setPlans([...data].sort((a, b) => a.id - b.id));
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load plans'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFieldErrors({});
    setShowForm(true);
  };

  const openEdit = (plan) => {
    setForm({
      name: plan.name,
      speedMbps: String(plan.speedMbps),
      dataLimitGb: plan.dataLimitGb == null ? '' : String(plan.dataLimitGb),
      price: String(plan.price),
      validityDays: String(plan.validityDays),
      description: plan.description || '',
    });
    setEditingId(plan.id);
    setFieldErrors({});
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});
    setSaving(true);

    // Empty number fields become null; an empty data limit means unlimited
    const toNumber = (value) => (value === '' ? null : Number(value));
    const payload = {
      name: form.name.trim(),
      speedMbps: toNumber(form.speedMbps),
      dataLimitGb: toNumber(form.dataLimitGb),
      price: toNumber(form.price),
      validityDays: toNumber(form.validityDays),
      description: form.description.trim(),
    };

    try {
      if (editingId) {
        await api.put(`/api/admin/plans/${editingId}`, payload);
        setSuccess(`Plan "${payload.name}" updated.`);
      } else {
        await api.post('/api/admin/plans', payload);
        setSuccess(`Plan "${payload.name}" created.`);
      }
      closeForm();
      await loadPlans();
    } catch (err) {
      setFieldErrors(getFieldErrors(err));
      setError(getErrorMessage(err, 'Could not save plan'));
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (plan) => {
    const action = plan.active ? 'Deactivate' : 'Activate';
    if (!window.confirm(`${action} the ${plan.name} plan?`)) return;
    setError('');
    setSuccess('');
    try {
      await api.patch(`/api/admin/plans/${plan.id}/toggle`);
      setSuccess(`${plan.name} is now ${plan.active ? 'inactive and hidden from customers' : 'active and visible to customers'}.`);
      await loadPlans();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const input = (name, label, type = 'text', extra = {}) => (
    <>
      <label className="form-label" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} value={form[name]} onChange={handleChange}
             className={`form-control ${fieldErrors[name] ? 'is-invalid' : ''}`} {...extra} />
      {fieldErrors[name] && <div className="invalid-feedback">{fieldErrors[name]}</div>}
    </>
  );

  return (
    <div className="container py-4">
      <PageHeader
        title="Manage plans"
        subtitle="Create, edit, and activate or deactivate internet plans."
        action={!showForm && <button className="btn btn-primary" onClick={openCreate}>+ Add plan</button>}
      />

      <Alert type="success" message={success} onClose={() => setSuccess('')} />
      <Alert message={error} onClose={() => setError('')} />

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">{editingId ? 'Edit plan' : 'New plan'}</h5>
            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                <div className="col-md-6">{input('name', 'Plan name')}</div>
                <div className="col-md-6">{input('price', 'Price (USD)', 'number', { min: 0, step: '0.01' })}</div>
                <div className="col-md-4">{input('speedMbps', 'Speed (Mbps)', 'number', { min: 1 })}</div>
                <div className="col-md-4">
                  {input('dataLimitGb', 'Data limit (GB)', 'number', { min: 1, placeholder: 'Leave empty for unlimited' })}
                </div>
                <div className="col-md-4">{input('validityDays', 'Validity (days)', 'number', { min: 1 })}</div>
                <div className="col-12">
                  <label className="form-label" htmlFor="description">Description</label>
                  <textarea id="description" name="description" rows="2" maxLength={500} className="form-control"
                            value={form.description} onChange={handleChange} />
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Save changes' : 'Create plan'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={closeForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <Loading text="Loading plans..." />
      ) : plans.length === 0 ? (
        <EmptyState message="No plans yet." />
      ) : (
        <div className="card"><div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr><th>#</th><th>Name</th><th>Speed</th><th>Data</th><th>Price</th><th>Validity</th><th>Status</th><th /></tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id} className={plan.active ? '' : 'text-muted'}>
                  <td>{plan.id}</td>
                  <td className="fw-semibold">{plan.name}</td>
                  <td>{formatSpeed(plan.speedMbps)}</td>
                  <td>{formatData(plan.dataLimitGb)}</td>
                  <td>{formatMoney(plan.price)}</td>
                  <td>{plan.validityDays} days</td>
                  <td>
                    <span className={`badge ${plan.active ? 'bg-success' : 'bg-secondary'}`}>
                      {plan.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="text-end text-nowrap">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEdit(plan)}>Edit</button>
                    <button className={`btn btn-sm ${plan.active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                            onClick={() => handleToggle(plan)}>
                      {plan.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div></div>
      )}
    </div>
  );
}
