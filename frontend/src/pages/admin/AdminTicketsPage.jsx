import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../../api/axios';
import { Alert, EmptyState, Loading, PageHeader, StatusBadge } from '../../components/ui';
import { formatDateTime } from '../../utils/format';

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [update, setUpdate] = useState({ status: 'OPEN', adminRemark: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadTickets = async () => {
    try {
      const { data } = await api.get('/api/admin/tickets');
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

  const startEdit = (ticket) => {
    setEditing(ticket.id);
    setUpdate({ status: ticket.status, adminRemark: ticket.adminRemark || '' });
  };

  const handleSave = async (ticket) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.patch(`/api/admin/tickets/${ticket.id}/status`, update);
      setSuccess(`Ticket #${ticket.id} updated. ${ticket.customerName} has been notified by email.`);
      setEditing(null);
      await loadTickets();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update ticket'));
    } finally {
      setSaving(false);
    }
  };

  const term = search.trim().toLowerCase();
  const visible = tickets.filter((t) =>
    (filter === 'ALL' || t.status === filter) &&
    (!term || t.subject.toLowerCase().includes(term) || t.customerName.toLowerCase().includes(term) ||
      t.customerEmail.toLowerCase().includes(term))
  );

  const countFor = (status) => tickets.filter((t) => t.status === status).length;

  return (
    <div className="container py-4">
      <PageHeader title="Support tickets" subtitle="Review customer issues and update their status." />

      <Alert type="success" message={success} onClose={() => setSuccess('')} />
      <Alert message={error} onClose={() => setError('')} />

      <div className="d-flex flex-wrap gap-2 mb-3">
        {['ALL', ...STATUSES].map((status) => (
          <button key={status}
                  className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setFilter(status)}>
            {status.replace('_', ' ')} ({status === 'ALL' ? tickets.length : countFor(status)})
          </button>
        ))}
        <input className="form-control form-control-sm ms-md-auto" style={{ maxWidth: 260 }}
               placeholder="Search subject or customer" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <Loading text="Loading tickets..." />
      ) : visible.length === 0 ? (
        <EmptyState message="No tickets match this filter." />
      ) : (
        <div className="d-flex flex-column gap-3">
          {visible.map((ticket) => (
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
                  {ticket.customerName} ({ticket.customerEmail}) · {ticket.category} · Opened {formatDateTime(ticket.createdAt)}
                </div>
                <p className="mb-2">{ticket.description}</p>
                {ticket.adminRemark && editing !== ticket.id && (
                  <div className="bg-light border-start border-4 border-primary rounded p-2 small mb-2">
                    <strong>Remark:</strong> {ticket.adminRemark}
                  </div>
                )}

                {editing === ticket.id ? (
                  <div className="border rounded p-3 mt-2">
                    <div className="row g-2">
                      <div className="col-md-4">
                        <label className="form-label small">Status</label>
                        <select className="form-select" value={update.status}
                                onChange={(e) => setUpdate({ ...update, status: e.target.value })}>
                          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                        </select>
                      </div>
                      <div className="col-md-8">
                        <label className="form-label small">Remark to customer</label>
                        <input className="form-control" maxLength={1000} value={update.adminRemark}
                               placeholder="e.g. Technician assigned to check your line"
                               onChange={(e) => setUpdate({ ...update, adminRemark: e.target.value })} />
                      </div>
                    </div>
                    <div className="d-flex gap-2 mt-3">
                      <button className="btn btn-sm btn-primary" disabled={saving} onClick={() => handleSave(ticket)}>
                        {saving ? 'Saving...' : 'Save and notify customer'}
                      </button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditing(null)}>Cancel</button>
                    </div>
                  </div>
                ) : ticket.status === 'CLOSED' ? (
                  <span className="small text-muted">This ticket is closed.</span>
                ) : (
                  <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(ticket)}>Update status</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
