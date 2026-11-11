import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios';
import { useAuth } from '../context/useAuth';
import { Alert, Loading, PageHeader, StatCard, StatusBadge } from '../components/ui';
import { daysUntil, formatDate, formatMoney, formatSpeed } from '../utils/format';

export default function DashboardPage() {
  const { user } = useAuth();
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [bills, setBills] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [currentRes, historyRes, billsRes, ticketsRes] = await Promise.all([
          api.get('/api/subscriptions/current'),
          api.get('/api/subscriptions'),
          api.get('/api/bills'),
          api.get('/api/tickets'),
        ]);
        setCurrent(currentRes.data || null);
        setHistory(historyRes.data);
        setBills(billsRes.data);
        setTickets(ticketsRes.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Could not load your dashboard'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loading text="Loading your dashboard..." />;

  const pendingBills = bills.filter((b) => b.status === 'PENDING');
  const pendingTotal = pendingBills.reduce((sum, b) => sum + Number(b.amount), 0);
  const openTickets = tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS');

  return (
    <div className="container py-4">
      <PageHeader title={`Welcome, ${user.fullName}`} subtitle="Here is an overview of your NetServe account." />
      <Alert message={error} />

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <StatCard label="Current plan" value={current ? current.planName : 'None'} accent="primary" />
        </div>
        <div className="col-md-4">
          <StatCard label="Amount due" value={formatMoney(pendingTotal)} accent={pendingTotal > 0 ? 'warning' : 'success'} />
        </div>
        <div className="col-md-4">
          <StatCard label="Open tickets" value={openTickets.length} accent="info" />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">My subscription</h5>
              {current ? (
                <>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <div className="fs-4 fw-bold">{current.planName}</div>
                      <div className="text-muted">{formatSpeed(current.speedMbps)} · {formatMoney(current.price)} per cycle</div>
                    </div>
                    <StatusBadge status={current.status} />
                  </div>
                  <div className="row text-center bg-light rounded py-3 mb-3 mx-0">
                    <div className="col">
                      <div className="small text-muted">Started</div>
                      <div className="fw-semibold">{formatDate(current.startDate)}</div>
                    </div>
                    <div className="col">
                      <div className="small text-muted">Renews on</div>
                      <div className="fw-semibold">{formatDate(current.endDate)}</div>
                    </div>
                    <div className="col">
                      <div className="small text-muted">Days left</div>
                      <div className="fw-semibold">{daysUntil(current.endDate)}</div>
                    </div>
                  </div>
                  <Link to="/plans" className="btn btn-outline-primary">Upgrade or downgrade plan</Link>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">You don't have an active plan yet.</p>
                  <Link to="/plans" className="btn btn-primary">Browse plans</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Pending bills</h5>
              {pendingBills.length === 0 ? (
                <p className="text-muted mb-0">You're all paid up. 🎉</p>
              ) : (
                <ul className="list-group list-group-flush mb-3">
                  {pendingBills.map((bill) => (
                    <li className="list-group-item d-flex justify-content-between px-0" key={bill.id}>
                      <span>#{bill.id} · {bill.planName}<br /><small className="text-muted">Due {formatDate(bill.dueDate)}</small></span>
                      <span className="fw-bold">{formatMoney(bill.amount)}</span>
                    </li>
                  ))}
                </ul>
              )}
              {pendingBills.length > 0 && <Link to="/bills" className="btn btn-warning">Pay now</Link>}
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Subscription history</h5>
              {history.length === 0 ? (
                <p className="text-muted mb-0">No subscriptions yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr><th>Plan</th><th>Speed</th><th>Price</th><th>Start</th><th>End</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {history.map((s) => (
                        <tr key={s.id}>
                          <td className="fw-semibold">{s.planName}</td>
                          <td>{formatSpeed(s.speedMbps)}</td>
                          <td>{formatMoney(s.price)}</td>
                          <td>{formatDate(s.startDate)}</td>
                          <td>{formatDate(s.endDate)}</td>
                          <td><StatusBadge status={s.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
