// Small reusable pieces used across pages

const BADGE_COLORS = {
  ACTIVE: 'success',
  PAID: 'success',
  RESOLVED: 'success',
  PENDING: 'warning',
  OPEN: 'primary',
  IN_PROGRESS: 'info',
  CANCELLED: 'secondary',
  EXPIRED: 'secondary',
  CLOSED: 'dark',
  LOW: 'secondary',
  MEDIUM: 'warning',
  HIGH: 'danger',
};

export function StatusBadge({ status }) {
  if (!status) return null;
  const color = BADGE_COLORS[status] || 'secondary';
  const textClass = color === 'warning' || color === 'info' ? ' text-dark' : '';
  return <span className={`badge bg-${color}${textClass}`}>{status.replace('_', ' ')}</span>;
}

export function Loading({ text = 'Loading...' }) {
  return (
    <div className="d-flex align-items-center justify-content-center py-5 text-muted">
      <div className="spinner-border spinner-border-sm me-2" role="status" />
      {text}
    </div>
  );
}

export function Alert({ type = 'danger', message, onClose }) {
  if (!message) return null;
  return (
    <div className={`alert alert-${type} d-flex justify-content-between align-items-start`} role="alert">
      <span>{message}</span>
      {onClose && <button type="button" className="btn-close ms-3" aria-label="Close" onClick={onClose} />}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
      <div>
        <h2 className="fw-bold mb-1">{title}</h2>
        {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, accent = 'primary' }) {
  return (
    <div className="card stat-card h-100">
      <div className={`card-body border-start border-4 border-${accent} rounded`}>
        <div className="text-muted small text-uppercase fw-semibold">{label}</div>
        <div className="fs-3 fw-bold mt-1">{value}</div>
      </div>
    </div>
  );
}

export function EmptyState({ message, children }) {
  return (
    <div className="text-center text-muted py-5">
      <p className="mb-3">{message}</p>
      {children}
    </div>
  );
}
