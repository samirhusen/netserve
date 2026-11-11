import { useEffect, useState } from 'react';
import api, { getErrorMessage, getFieldErrors } from '../api/axios';
import { Alert, EmptyState, Loading, PageHeader, StatusBadge } from '../components/ui';
import { formatDateTime } from '../utils/format';

const CATEGORIES = ['Connectivity', 'Slow speed', 'Billing', 'Installation', 'Account', 'Other'];
const EMPTY_FORM = { subject: '', category: 'Connectivity', priority: 'MEDIUM', description: '' };

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadTickets = async () => {
    try {
      const { data } = await api.get('/api/tickets');
      setTickets(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load tickets'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});
    setSubmitting(true);
    try {
      const { data } = await api.post('/api/tickets', form);
      setSuccess(`Ticket #${data.id} created. You'll get an email whenever our team updates it.`);
      setForm(EMPTY_FORM);
      setShowForm(false);
      await loadTickets();
    } catch (err) {
      setFieldErrors(getFieldErrors(err));
      setError(getErrorMessage(err, 'Could not create ticket'));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (name) => `form-control ${fieldErrors[name] ? 'is-invalid' : ''}`;

  return (
    <div className="container py-4">
      <PageHeader
        title="Support tickets"
        subtitle="Report an issue and track its progress."
        action={!showForm && <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ New ticket</button>}
      />

      <Alert type="success" message={success} onClose={() => setSuccess('')} />
      <Alert message={error} onClose={() => setError('')} />

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Raise a new ticket</h5>
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label" htmlFor="subject">Subject</label>
                <input id="subject" name="subject" className={inputClass('subject')} value={form.subject}
                       onChange={handleChange} placeholder="Briefly describe the issue" />
                {fieldErrors.subject && <div className="invalid-feedback">{fieldErrors.subject}</div>}
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="category">Category</label>
                  <select id="category" name="category" className="form-select" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="priority">Priority</label>
                  <select id="priority" name="priority" className="form-select" value={form.priority} onChange={handleChange}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea id="description" name="description" rows="4" maxLength={1000} className={inputClass('description')}
                          value={form.description} onChange={handleChange}
                          placeholder="Tell us what's happening, when it started, and anything you've tried" />
                {fieldErrors.description && <div className="invalid-feedback">{fieldErrors.description}</div>}
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit ticket'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => { setShowForm(false); setFieldErrors({}); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <Loading text="Loading tickets..." />
      ) : tickets.length === 0 ? (
        <EmptyState message="You haven't raised any tickets yet." />
      ) : (
        <div className="d-flex flex-column gap-3">
          {tickets.map((ticket) => (
            <div className="card" key={ticket.id}>
              <div className="card-body">
                <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                  <div>
                    <span className="text-muted me-2">#{ticket.id}</span>
                    <span className="fw-bold">{ticket.subject}</span>
                  </div>
                  <div className="d-flex gap-2">
                    <StatusBadge status={ticket.priority} />
                    <StatusBadge status={ticket.status} />
                  </div>
                </div>
                <div className="small text-muted mb-2">
                  {ticket.category} · Opened {formatDateTime(ticket.createdAt)} · Last updated {formatDateTime(ticket.updatedAt)}
                </div>
                <p className="mb-2">{ticket.description}</p>
                {ticket.adminRemark && (
                  <div className="bg-light border-start border-4 border-primary rounded p-2 small">
                    <strong>Support team:</strong> {ticket.adminRemark}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
