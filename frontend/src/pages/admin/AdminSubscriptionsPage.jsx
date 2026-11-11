import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../../api/axios';
import { Alert, EmptyState, Loading, PageHeader, StatusBadge } from '../../components/ui';
import { formatDate, formatMoney, formatSpeed } from '../../utils/format';

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/api/admin/subscriptions');
        setSubscriptions(data);
      } catch (err) {
        setError(getErrorMessage(err, 'Could not load subscriptions'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const term = search.trim().toLowerCase();
  const visible = subscriptions.filter((s) =>
    (filter === 'ALL' || s.status === filter) &&
    (!term || s.customerName.toLowerCase().includes(term) || s.customerEmail.toLowerCase().includes(term) ||
      s.planName.toLowerCase().includes(term))
  );

  return (
    <div className="container py-4">
      <PageHeader title="Subscriptions" subtitle="Every customer subscription, current and past." />
      <Alert message={error} />

      <div className="d-flex flex-wrap gap-2 mb-3">
        {['ALL', 'ACTIVE', 'CANCELLED', 'EXPIRED'].map((status) => (
          <button key={status}
                  className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setFilter(status)}>
            {status}
          </button>
        ))}
        <input className="form-control form-control-sm ms-md-auto" style={{ maxWidth: 260 }}
               placeholder="Search customer or plan" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <Loading text="Loading subscriptions..." />
      ) : visible.length === 0 ? (
        <EmptyState message="No subscriptions match this filter." />
      ) : (
        <div className="card"><div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr><th>#</th><th>Customer</th><th>Plan</th><th>Speed</th><th>Price</th><th>Start</th><th>End</th><th>Status</th></tr>
            </thead>
            <tbody>
              {visible.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>
                    <div className="fw-semibold">{s.customerName}</div>
                    <div className="small text-muted">{s.customerEmail}</div>
                  </td>
                  <td>{s.planName}</td>
                  <td>{formatSpeed(s.speedMbps)}</td>
                  <td>{formatMoney(s.price)}</td>
                  <td>{formatDate(s.startDate)}</td>
                  <td>{formatDate(s.endDate)}</td>
                  <td><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div></div>
      )}
    </div>
  );
}
