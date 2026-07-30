import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi, voucherApi } from '../../api/vouchers';
import { formatCurrency, formatDate } from '../../utils/format';
import StatusStamp from '../../components/StatusStamp';
import {
  FilePlus,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Building2,
  ArrowRight,
  Sparkles,
  Calendar,
  DollarSign,
} from 'lucide-react';

export default function EmployeeDashboard() {
  const [data, setData] = useState(null);
  const [recentVouchers, setRecentVouchers] = useState([]);
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([
      dashboardApi.employee(),
      voucherApi.getMyVouchers({ limit: 5 }),
      dashboardApi.budget(),
    ])
      .then(([dashRes, listRes, budgetRes]) => {
        setData(dashRes.data);
        setRecentVouchers(listRes.data.vouchers || []);
        // Find the logged-in employee's department budget
        const depts = budgetRes.data.departments || [];
        const myDept = depts.find((d) => d.name === user?.department) || null;
        setBudgetData(myDept ? myDept : { name: user?.department || 'Engineering', spent: 0, budget: budgetRes.data.monthlyBudgetPerDept, utilizationPct: 0 });
      })
      .finally(() => setLoading(false));
  }, [user?.department]);


  return (
    <div className="space-y-8">
      {/* Dashboard Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-50 via-white to-amber-50/40 p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1d5b96] uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-[#f39c12]" />
            <span>Employee Workspace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Expense Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track claims, submit advance requests, and view approval statuses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/employee/create"
            className="inline-flex items-center gap-2 bg-[#1d5b96] hover:bg-[#14426f] text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <FilePlus className="w-4 h-4 text-[#f39c12]" />
            <span>Create New Claim / Advance</span>
          </Link>
        </div>
      </div>

      {/* Department Budget Allocation Indicator */}
      {budgetData && (
        <div className={`bg-white p-6 rounded-3xl border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${
          budgetData.utilizationPct >= 90 ? 'border-red-300 bg-red-50/30' :
          budgetData.utilizationPct >= 70 ? 'border-amber-300 bg-amber-50/30' :
          'border-slate-200/80'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl shrink-0 ${
              budgetData.utilizationPct >= 90 ? 'bg-red-100 text-red-600' :
              budgetData.utilizationPct >= 70 ? 'bg-amber-100 text-amber-700' :
              'bg-blue-50 text-[#1d5b96]'
            }`}>
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{budgetData.name} Monthly Expense Allocation</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monthly Budget: <strong>₹{(budgetData.budget / 100000).toFixed(0)} Lakh</strong> · Utilized this month:{' '}
                <strong className={budgetData.utilizationPct >= 90 ? 'text-red-600' : budgetData.utilizationPct >= 70 ? 'text-amber-700' : 'text-slate-700'}>
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(budgetData.spent)} ({budgetData.utilizationPct}%)
                </strong>
              </p>
              {budgetData.utilizationPct >= 90 && (
                <p className="text-[11px] font-bold text-red-600 mt-1">⚠ Budget near limit — coordinate with Finance before submitting high-value requests.</p>
              )}
            </div>
          </div>
          <div className="w-full sm:w-64 space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Budget Usage</span>
              <span className={budgetData.utilizationPct >= 90 ? 'text-red-600' : budgetData.utilizationPct >= 70 ? 'text-amber-700' : 'text-[#1d5b96]'}>{budgetData.utilizationPct}%</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
              <div
                className={`h-full rounded-full transition-all ${
                  budgetData.utilizationPct >= 90 ? 'bg-red-500' :
                  budgetData.utilizationPct >= 70 ? 'bg-amber-500' :
                  'bg-gradient-to-r from-[#1d5b96] to-[#f39c12]'
                }`}
                style={{ width: `${budgetData.utilizationPct}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Key Metric Stat Cards */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Claims</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">{data.totalVouchers}</div>
            <div className="text-[11px] text-slate-500 mt-1">Submitted in portal</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending Approval</div>
            <div className="text-3xl font-extrabold text-[#f39c12] mt-2">{data.pendingApproval}</div>
            <div className="text-[11px] text-slate-500 mt-1">Under Director review</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Approved</div>
            <div className="text-3xl font-extrabold text-emerald-700 mt-2">{data.approvedVouchers}</div>
            <div className="text-[11px] text-slate-500 mt-1">Authorized for payout</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="text-xs font-semibold text-[#1d5b96] uppercase tracking-wider">Total Amount Paid</div>
            <div className="text-2xl font-extrabold text-[#1d5b96] mt-2">
              {formatCurrency(data.totalAmountClaimed)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Disbursed to date</div>
          </div>
        </div>
      )}

      {/* Recent Vouchers Preview Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent Voucher Submissions</h2>
            <p className="text-xs text-slate-500 mt-0.5">Your latest expense reimbursements & advance requests.</p>
          </div>
          <Link
            to="/employee/vouchers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1d5b96] hover:underline"
          >
            <span>View All Vouchers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentVouchers.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-sm font-semibold text-slate-600">No voucher claims submitted yet.</p>
            <Link
              to="/employee/create"
              className="mt-3 inline-block text-xs font-bold text-[#1d5b96] hover:underline"
            >
              + Submit your first claim now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Voucher No</th>
                  <th className="p-4">Title & Type</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentVouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#1d5b96]">{v.voucherNumber}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{v.expenseTitle}</div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">
                        {v.voucherType === 'advance' ? '⚡ Advance Request' : '🧾 Reimbursement'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{v.expenseCategory}</td>
                    <td className="p-4 text-slate-600">{formatDate(v.expenseDate)}</td>
                    <td className="p-4 font-mono font-bold text-slate-900">{formatCurrency(v.amount)}</td>
                    <td className="p-4">
                      <StatusStamp status={v.status} />
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/employee/vouchers/${v.id}`}
                        className="text-xs font-bold text-[#1d5b96] hover:underline"
                      >
                        Details →
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
