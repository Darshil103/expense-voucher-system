export default function StatusStamp({ status }) {
  const config = {
    draft: { label: 'Draft', classes: 'bg-slate-100 text-slate-600 border-slate-200' },
    pending_approval: { label: 'Pending Approval', classes: 'bg-amber-100 text-amber-800 border-amber-200' },
    approved: { label: 'Approved', classes: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    rejected: { label: 'Rejected', classes: 'bg-red-100 text-red-800 border-red-200' },
  };

  const c = config[status] || config.draft;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${c.classes}`}>
      {c.label}
    </span>
  );
}
