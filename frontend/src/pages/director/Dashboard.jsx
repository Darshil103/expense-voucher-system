import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi, voucherApi } from '../../api/vouchers';
import { formatCurrency, formatDate } from '../../utils/format';
import {
  ClipboardCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  PieChart as ChartIcon,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#1d5b96', '#f39c12', '#2ecc71', '#9b59b6', '#e74c3c', '#1abc9c', '#34495e'];

export default function DirectorDashboard() {
  const [data, setData] = useState(null);
  const [pendingVouchers, setPendingVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardApi.director(), voucherApi.getPendingApprovals({ limit: 100 })])
      .then(([dashRes, pendRes]) => {
        setData(dashRes.data);
        setPendingVouchers(pendRes.data.vouchers || []);
      })
      .finally(() => setLoading(false));
  }, []);

  // Compute category distribution for charts
  const categoryData = Object.values(
    pendingVouchers.reduce((acc, v) => {
      const cat = v.expenseCategory || 'Other';
      if (!acc[cat]) {
        acc[cat] = { name: cat, value: 0 };
      }
      acc[cat].value += Number(v.amount || 0);
      return acc;
    }, {})
  ).map(item => ({
    ...item,
    value: parseFloat(item.value.toFixed(2))
  }));

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-50/60 via-white to-blue-50/40 p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f39c12] uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-[#1d5b96]" />
            <span>Executive Approval Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Director Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Review pending claims, authorize digital signatures, and oversee company expenditure.
          </p>
        </div>

        <Link
          to="/director/pending"
          className="inline-flex items-center gap-2 bg-[#f39c12] hover:bg-[#d98205] text-slate-950 font-extrabold text-sm px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all"
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Review Pending Approvals ({data?.pendingApprovalCount || 0})</span>
        </Link>
      </div>

      {/* Metrics Row */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Awaiting Signature</div>
            <div className="text-3xl font-extrabold text-[#f39c12] mt-2">{data.pendingApprovalCount}</div>
            <div className="text-[11px] text-slate-500 mt-1">Vouchers in queue</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Approved Today</div>
            <div className="text-3xl font-extrabold text-emerald-700 mt-2">{data.approvedToday}</div>
            <div className="text-[11px] text-slate-500 mt-1">Authorized claims</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="text-xs font-bold text-red-600 uppercase tracking-wider">Rejected Today</div>
            <div className="text-3xl font-extrabold text-red-600 mt-2">{data.rejectedToday}</div>
            <div className="text-[11px] text-slate-500 mt-1">Non-compliant requests</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="text-xs font-bold text-[#1d5b96] uppercase tracking-wider">Total Pending Value</div>
            <div className="text-2xl font-extrabold text-[#1d5b96] mt-2">
              {formatCurrency(data.totalPendingAmount)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Pending payout total</div>
          </div>
        </div>
      )}

      {/* Analytics Chart Block */}
      {categoryData.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-[#f39c12] rounded-xl shrink-0">
              <ChartIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pending Claims Breakdown</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribution of pending approval request values grouped by expense category.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category Legend</h3>
              <div className="grid grid-cols-2 gap-3">
                {categoryData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{formatCurrency(item.value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pending Approvals Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Vouchers Requiring Your Approval</h2>
            <p className="text-xs text-slate-500 mt-0.5">Inspect claim details and authorize with your digital signature.</p>
          </div>
          <Link
            to="/director/pending"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1d5b96] hover:underline"
          >
            <span>View All Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingVouchers.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">Queue Clear!</p>
            <p className="text-xs text-slate-500 mt-1">No vouchers pending your signature approval at this moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Voucher No</th>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Title & Type</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {pendingVouchers.slice(0, 5).map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#1d5b96]">{v.voucherNumber}</td>
                    <td className="p-4 font-bold text-slate-900">{v.employeeName}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{v.expenseTitle}</div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">
                        {v.voucherType === 'advance' ? '⚡ Advance Request' : '🧾 Reimbursement'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{v.departmentName}</td>
                    <td className="p-4 font-mono font-bold text-slate-900">{formatCurrency(v.amount)}</td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/director/vouchers/${v.id}`}
                        className="inline-flex items-center gap-1 bg-[#1d5b96] hover:bg-[#14426f] text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-sm transition-all"
                      >
                        Inspect & Sign
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
