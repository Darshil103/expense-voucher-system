export function formatCurrency(amount) {
  const n = Number(amount || 0);
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function fileUrl(path) {
  if (!path) return null;
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  return base.replace(/\/api$/, '') + path;
}
