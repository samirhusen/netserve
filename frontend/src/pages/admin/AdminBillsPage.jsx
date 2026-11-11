import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../../api/axios';
import { Alert, EmptyState, Loading, PageHeader, StatCard, StatusBadge } from '../../components/ui';
import { formatDate, formatDateTime, formatMoney } from '../../utils/format';

export default function AdminBillsPage() {
  const [bills, setBills] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/api/admin/bills');
        setBills(data);
      } catch (err) {
        setError(getErrorMessage(err, 'Could not load bills'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const sumOf = (status) =>
    bills.filter((b) => b.status === status).reduce((sum, b) => sum + Number(b.amount), 0);
  const visible = bills.filter((b) => filter === 'ALL' || b.status === filter);

  return (
    <div className="container py-4">
      <PageHeader title="Bills" subtitle="All bills generated across customers." />
      <Alert message={error} />

      <div className="row g-3 mb-4">
        <div className="col-md-4"><StatCard label="Total bills" value={bills.length} accent="primary" /></div>
        <div className="col-md-4"><StatCard label="Collected" value={formatMoney(sumOf('PAID'))} accent="success" /></div>
        <div className="col-md-4"><StatCard label="Outstanding" value={formatMoney(sumOf('PENDING'))} accent="warning" /></div>
      </div>

      <div className="d-flex gap-2 mb-3">
        {['ALL', 'PENDING', 'PAID'].map((status) => (
          <button key={status}
                  className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setFilter(status)}>
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <Loading text="Loading bills..." />
      ) : visible.length === 0 ? (
        <EmptyState message="No bills match this filter." />
      ) : (
        <div className="card"><div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr><th>Bill</th><th>Customer</th><th>Plan</th><th>Amount</th><th>Issued</th><th>Due</th><th>Paid on</th><th>Status</th></tr>
            </thead>
            <tbody>
              {visible.map((b) => (
                <tr key={b.id}>
                  <td className="fw-semibold">#{b.id}</td>
                  <td>{b.customerName}</td>
                  <td>{b.planName}</td>
                  <td>{formatMoney(b.amount)}</td>
                  <td>{formatDate(b.issueDate)}</td>
                  <td>{formatDate(b.dueDate)}</td>
                  <td>{formatDateTime(b.paidAt)}</td>
                  <td><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div></div>
      )}
    </div>
  );
}
