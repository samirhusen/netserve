import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import api, { getErrorMessage } from '../../api/axios';
import { Alert, Loading, PageHeader, StatCard } from '../../components/ui';
import { formatMoney } from '../../utils/format';

// Chart.js needs each piece registered once before it can draw
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler, Tooltip, Legend);

const BRAND = '#2f6fed';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/api/admin/dashboard');
        setStats(data);
      } catch (err) {
        setError(getErrorMessage(err, 'Could not load dashboard'));
      }
    };
    load();
  }, []);

  if (!stats && !error) return <Loading text="Loading dashboard..." />;

  const planChart = stats && {
    labels: stats.subscribersPerPlan.map((p) => p.plan),
    datasets: [{
      label: 'Active subscribers',
      data: stats.subscribersPerPlan.map((p) => p.subscribers),
      backgroundColor: BRAND,
      borderRadius: 6,
      maxBarThickness: 56,
    }],
  };

  const revenueChart = stats && {
    labels: stats.monthlyRevenue.map((m) => m.month),
    datasets: [{
      label: 'Revenue',
      data: stats.monthlyRevenue.map((m) => Number(m.revenue)),
      borderColor: BRAND,
      backgroundColor: 'rgba(47, 111, 237, 0.12)',
      fill: true,
      tension: 0.3,
      pointRadius: 4,
    }],
  };

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  const planOptions = {
    ...baseOptions,
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  const revenueOptions = {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      tooltip: { callbacks: { label: (ctx) => formatMoney(ctx.parsed.y) } },
    },
    scales: { y: { beginAtZero: true, ticks: { callback: (value) => `$${value}` } } },
  };

  return (
    <div className="container py-4">
      <PageHeader title="Admin dashboard" subtitle="A live overview of subscribers, revenue, and support." />
      <Alert message={error} />

      {stats && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-6 col-lg-3"><StatCard label="Customers" value={stats.totalCustomers} accent="primary" /></div>
            <div className="col-6 col-lg-3"><StatCard label="Active subscriptions" value={stats.activeSubscriptions} accent="success" /></div>
            <div className="col-6 col-lg-3"><StatCard label="Open tickets" value={stats.openTickets} accent="warning" /></div>
            <div className="col-6 col-lg-3"><StatCard label="Total revenue" value={formatMoney(stats.totalRevenue)} accent="info" /></div>
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">Subscribers per plan</h5>
                  {stats.subscribersPerPlan.length === 0 ? (
                    <p className="text-muted">No active subscriptions yet.</p>
                  ) : (
                    <div className="chart-box"><Bar data={planChart} options={planOptions} /></div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">Monthly revenue (last 6 months)</h5>
                  <div className="chart-box"><Line data={revenueChart} options={revenueOptions} /></div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 mt-4">
            <Link to="/admin/tickets" className="btn btn-outline-primary">Manage tickets</Link>
            <Link to="/admin/plans" className="btn btn-outline-primary">Manage plans</Link>
            <Link to="/admin/subscriptions" className="btn btn-outline-primary">View subscriptions</Link>
          </div>
        </>
      )}
    </div>
  );
}
