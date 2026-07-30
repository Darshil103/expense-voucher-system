import { Link } from 'react-router-dom';
import StatusStamp from './StatusStamp';
import { formatCurrency, formatDate } from '../utils/format';

export default function VoucherTable({ vouchers = [], basePath, showEmployee = false }) {
  if (!vouchers.length) {
    return (
      <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
        <p className="text-sm font-semibold text-slate-600">No vouchers found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-2xl">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
          <tr>
            <th className="p-4">Voucher No</th>
            {showEmployee && <th className="p-4">Employee</th>}
            <th className="p-4">Title</th>
            <th className="p-4">Category</th>
            <th className="p-4">Date</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          {vouchers.map((v) => (
            <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="p-4 font-mono font-bold text-[#1d5b96]">{v.voucherNumber}</td>
              {showEmployee && <td className="p-4 font-bold text-slate-900">{v.employeeName}</td>}
              <td className="p-4">
                <div className="font-bold text-slate-900">{v.expenseTitle}</div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">
                  {v.voucherType === 'advance' ? '⚡ Advance' : '🧾 Reimbursement'}
                </span>
              </td>
              <td className="p-4 text-slate-600">{v.expenseCategory}</td>
              <td className="p-4 text-slate-600">{formatDate(v.expenseDate)}</td>
              <td className="p-4 font-mono font-bold text-slate-900">{formatCurrency(v.amount)}</td>
              <td className="p-4"><StatusStamp status={v.status} /></td>
              <td className="p-4 text-right">
                <Link to={`${basePath}/${v.id}`} className="text-xs font-bold text-[#1d5b96] hover:underline">
                  Details →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
