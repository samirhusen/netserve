import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/axios';
import { Alert, EmptyState, Loading, PageHeader, StatusBadge } from '../components/ui';
import { formatDate, formatDateTime, formatMoney } from '../utils/format';

export default function BillsPage() {
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tab, setTab] = useState('bills');
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    try {
      const [billsRes, paymentsRes] = await Promise.all([api.get('/api/bills'), api.get('/api/bills/payments')]);
      setBills(billsRes.data);
      setPayments(paymentsRes.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load bills'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePay = async (bill) => {
    if (!window.confirm(`Pay ${formatMoney(bill.amount)} for bill #${bill.id}?`)) return;
    setPayingId(bill.id);
    setError('');
    setSuccess('');
    try {
      await api.post(`/api/bills/${bill.id}/pay`);
      setSuccess(`Payment of ${formatMoney(bill.amount)} received for bill #${bill.id}. A receipt has been emailed to you.`);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err, 'Payment failed'));
    } finally {
      setPayingId(null);
    }
  };

  const pending = bills.filter((b) => b.status === 'PENDING');
  const pendingTotal = pending.reduce((sum, b) => sum + Number(b.amount), 0);
  const paidTotal = payments.reduce((sum, b) => sum + Number(b.amount), 0);

  return (
    <div className="container py-4">
      <PageHeader title="Bills and payments" subtitle="View your bills, pay pending ones, and see your payment history." />

      <Alert type="success" message={success} onClose={() => setSuccess('')} />
      <Alert message={error} onClose={() => setError('')} />

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card"><div className="card-body">
            <div className="text-muted small text-uppercase fw-semibold">Amount due</div>
            <div className="fs-3 fw-bold">{formatMoney(pendingTotal)}</div>
            <div className="small text-muted">{pending.length} pending bill{pending.length === 1 ? '' : 's'}</div>
          </div></div>
        </div>
        <div className="col-md-6">
          <div className="card"><div className="card-body">
            <div className="text-muted small text-uppercase fw-semibold">Total paid</div>
            <div className="fs-3 fw-bold">{formatMoney(paidTotal)}</div>
            <div className="small text-muted">{payments.length} payment{payments.length === 1 ? '' : 's'}</div>
          </div></div>
        </div>
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${tab === 'bills' ? 'active' : ''}`} onClick={() => setTab('bills')}>All bills</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'payments' ? 'active' : ''}`} onClick={() => setTab('payments')}>Payment history</button>
        </li>
      </ul>

      {loading ? (
        <Loading text="Loading bills..." />
      ) : tab === 'bills' ? (
        bills.length === 0 ? (
          <EmptyState message="You have no bills yet. Bills are created when you subscribe to a plan." />
        ) : (
          <div className="card"><div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr><th>Bill</th><th>Plan</th><th>Amount</th><th>Issued</th><th>Due</th><th>Status</th><th /></tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.id}>
                    <td className="fw-semibold">#{bill.id}</td>
                    <td>{bill.planName}</td>
                    <td>{formatMoney(bill.amount)}</td>
                    <td>{formatDate(bill.issueDate)}</td>
                    <td>{formatDate(bill.dueDate)}</td>
                    <td><StatusBadge status={bill.status} /></td>
                    <td className="text-end">
                      {bill.status === 'PENDING' && (
                        <button className="btn btn-sm btn-success" disabled={payingId !== null} onClick={() => handlePay(bill)}>
                          {payingId === bill.id ? 'Paying...' : 'Pay now'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div></div>
        )
      ) : payments.length === 0 ? (
        <EmptyState message="No payments yet." />
      ) : (
        <div className="card"><div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr><th>Bill</th><th>Plan</th><th>Amount</th><th>Paid on</th><th>Status</th></tr>
            </thead>
            <tbody>
              {payments.map((bill) => (
                <tr key={bill.id}>
                  <td className="fw-semibold">#{bill.id}</td>
                  <td>{bill.planName}</td>
                  <td>{formatMoney(bill.amount)}</td>
                  <td>{formatDateTime(bill.paidAt)}</td>
                  <td><StatusBadge status={bill.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div></div>
      )}
    </div>
  );
}
