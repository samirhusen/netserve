export function formatMoney(value) {
  const number = Number(value ?? 0);
  return `$${number.toFixed(2)}`;
}

// Handles both "2026-11-09" (LocalDate) and "2026-11-09T18:20:00" (LocalDateTime)
// Plain dates are built in local time so they never shift by a day
export function formatDate(value) {
  if (!value) return '-';
  const plainDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const date = plainDate
    ? new Date(Number(plainDate[1]), Number(plainDate[2]) - 1, Number(plainDate[3]))
    : new Date(value);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatData(dataLimitGb) {
  return dataLimitGb == null ? 'Unlimited data' : `${dataLimitGb} GB data`;
}

export function formatSpeed(speedMbps) {
  return speedMbps >= 1000 ? `${speedMbps / 1000} Gbps` : `${speedMbps} Mbps`;
}

export function daysUntil(value) {
  if (!value) return 0;
  const [year, month, day] = value.split('-').map(Number);
  const end = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((end - today) / 86400000));
}
