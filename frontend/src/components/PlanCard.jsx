import { formatData, formatMoney, formatSpeed } from '../utils/format';

export default function PlanCard({ plan, highlight, children }) {
  return (
    <div className={`card plan-card h-100 ${highlight ? 'plan-card-current' : ''}`}>
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h4 className="fw-bold mb-0">{plan.name}</h4>
          {highlight && <span className="badge bg-success">Your plan</span>}
        </div>

        <div className="plan-speed">{formatSpeed(plan.speedMbps)}</div>

        <div className="my-3">
          <span className="fs-2 fw-bold">{formatMoney(plan.price)}</span>
          <span className="text-muted"> / {plan.validityDays} days</span>
        </div>

        <ul className="list-unstyled small text-muted mb-4">
          <li className="mb-1">✓ {formatSpeed(plan.speedMbps)} download speed</li>
          <li className="mb-1">✓ {formatData(plan.dataLimitGb)}</li>
          <li className="mb-1">✓ {plan.validityDays} day validity</li>
        </ul>

        {plan.description && <p className="small mb-4">{plan.description}</p>}

        <div className="mt-auto">{children}</div>
      </div>
    </div>
  );
}
