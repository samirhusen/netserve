import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios';
import { useAuth } from '../context/useAuth';
import PlanCard from '../components/PlanCard';
import { Alert, Loading, PageHeader } from '../components/ui';
import { formatMoney } from '../utils/format';

export default function PlansPage() {
  const { user, isCustomer, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [plans, setPlans] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyPlanId, setBusyPlanId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(
    location.state?.welcome ? 'Your account is ready and a welcome email is on its way. Pick a plan to get started.' : ''
  );

  const loadData = async () => {
    try {
      const plansRequest = api.get('/api/plans');
      const currentRequest = isCustomer ? api.get('/api/subscriptions/current') : Promise.resolve({ data: null });
      const [plansRes, currentRes] = await Promise.all([plansRequest, currentRequest]);
      setPlans([...plansRes.data].sort((a, b) => Number(a.price) - Number(b.price)));
      // The backend returns 204 with an empty body when there is no active plan
      setCurrent(currentRes.data || null);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load plans'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCustomer]);

  const handleSubscribe = async (plan) => {
    const changing = Boolean(current);
    const question = changing
      ? `Switch from ${current.planName} to ${plan.name} for ${formatMoney(plan.price)}? A new bill will be generated.`
      : `Subscribe to ${plan.name} for ${formatMoney(plan.price)}? A bill will be generated.`;
    if (!window.confirm(question)) return;

    setBusyPlanId(plan.id);
    setError('');
    setSuccess('');
    try {
      if (changing) {
        await api.put('/api/subscriptions/change', { planId: plan.id });
        setSuccess(`Your plan was changed to ${plan.name}. A confirmation email has been sent.`);
      } else {
        await api.post('/api/subscriptions', { planId: plan.id });
        setSuccess(`You are now subscribed to ${plan.name}. A confirmation email has been sent.`);
      }
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyPlanId(null);
    }
  };

  const renderAction = (plan) => {
    if (!user) {
      return <button className="btn btn-primary w-100" onClick={() => navigate('/register')}>Get started</button>;
    }
    if (isAdmin) {
      return <Link className="btn btn-outline-secondary w-100" to="/admin/plans">Manage plans</Link>;
    }
    if (current?.planId === plan.id) {
      return <button className="btn btn-success w-100" disabled>Current plan</button>;
    }
    const busy = busyPlanId === plan.id;
    const label = current ? (Number(plan.price) > Number(current.price) ? 'Upgrade' : 'Downgrade') : 'Subscribe';
    return (
      <button className="btn btn-primary w-100" disabled={busyPlanId !== null} onClick={() => handleSubscribe(plan)}>
        {busy ? 'Please wait...' : label}
      </button>
    );
  };

  return (
    <div className="container py-4">
      <PageHeader
        title="Internet plans"
        subtitle={current ? `You are on the ${current.planName} plan. Compare and switch anytime.` : 'Compare our plans and pick the one that fits you.'}
        action={success && isCustomer && <Link to="/bills" className="btn btn-outline-primary">View my bills</Link>}
      />

      <Alert type="success" message={success} onClose={() => setSuccess('')} />
      <Alert message={error} onClose={() => setError('')} />

      {loading ? (
        <Loading text="Loading plans..." />
      ) : plans.length === 0 ? (
        <p className="text-muted">No plans are available right now.</p>
      ) : (
        <div className="row g-4">
          {plans.map((plan) => (
            <div className="col-md-6 col-lg-4" key={plan.id}>
              <PlanCard plan={plan} highlight={current?.planId === plan.id}>
                {renderAction(plan)}
              </PlanCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
