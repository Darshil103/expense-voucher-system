export default function StatCard({ label, value }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-extrabold text-slate-900 mt-2">{value ?? '—'}</div>
    </div>
  );
}
