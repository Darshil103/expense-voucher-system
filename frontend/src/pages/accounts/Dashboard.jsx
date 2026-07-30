import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/vouchers';
import { formatCurrency, formatDate } from '../../utils/format';
import VoucherTable from '../../components/VoucherTable';
import {
  Sparkles,
  ArrowRight,
  Download,
  CheckCircle2,
  PieChart,
  Banknote,
  Building2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

export default function AccountsDashboard() {
  const [data, setData] = useState(null);
  const [departments, setDepartments] = useState([]);

  function load() {
    dashboardApi.accounts().then((res) => setData(res.data));
    dashboardApi.budget().then((res) => setDepartments(res.data.departments || []));
  }

  useEffect(() => {
    load();
  }, []);

  const handleExportCsv = () => {
    const url = dashboardApi.exportCsvUrl();
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-50/60 via-white to-blue-50/40 p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-[#f39c12]" />
            <span>Finance &amp; Disbursement</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Accounts Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Company-wide reimbursement processing, audit tracking, and payment settlement overview.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <Link
            to="/accounts/vouchers"
            className="inline-flex items-center gap-2 bg-[#1d5b96] hover:bg-[#14426f] text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all"
          >
            <PieChart className="w-4 h-4 text-[#f39c12]" />
            <span>View All Vouchers</span>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Vouchers</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">{data.totalVouchers}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending Approval</div>
              <div className="text-3xl font-extrabold text-[#f39c12] mt-2">{data.pendingApproval}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Approved</div>
              <div className="text-3xl font-extrabold text-emerald-700 mt-2">{data.approvedVouchers}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="text-xs font-semibold text-red-600 uppercase tracking-wider">Rejected</div>
              <div className="text-3xl font-extrabold text-red-600 mt-2">{data.rejectedVouchers}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="text-xs font-semibold text-[#1d5b96] uppercase tracking-wider">Total Approved ₹</div>
              <div className="text-2xl font-extrabold text-[#1d5b96] mt-2">{formatCurrency(data.totalApprovedExpenseAmount)}</div>
            </div>
          </div>

          {/* Departmental Expenditure Chart */}
          {departments.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-[#1d5b96] rounded-xl shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Department Spending vs. Budget</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Monthly spending overview per department compared to the ₹5,00,000 corporate budget threshold.
                  </p>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departments}
                    margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="name"
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value) => [formatCurrency(value), 'Spend']}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <ReferenceLine
                      y={500000}
                      stroke="#EF4444"
                      strokeDasharray="4 4"
                      label={{
                        value: 'Budget Limit: ₹5L',
                        fill: '#EF4444',
                        fontSize: 10,
                        fontWeight: 'bold',
                        position: 'top',
                      }}
                    />
                    <Bar
                      dataKey="spent"
                      fill="#1d5b96"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={45}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Pending Disbursement Alert Panel */}
          {data.pendingDisbursementVouchers && data.pendingDisbursementVouchers.length > 0 && (
            <div className="bg-white rounded-3xl border border-amber-300/60 shadow-sm overflow-hidden">
              <div className="bg-amber-50/80 border-b border-amber-200/60 px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <Banknote className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">
                      Pending Disbursement
                      <span className="ml-2 text-xs font-bold bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full">
                        {data.pendingDisbursementVouchers.length} vouchers
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Director-approved vouchers awaiting payment disbursement. Total:{' '}
                      <strong className="text-amber-700">{formatCurrency(data.pendingDisbursementAmount)}</strong>
                    </p>
                  </div>
                </div>
                <Link
                  to="/accounts/vouchers"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:underline shrink-0"
                >
                  <span>Process All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="p-6 sm:p-8 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Voucher No</th>
                      <th className="p-3">Employee</th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Approved On</th>
                      <th className="p-3 text-right">Amount</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {data.pendingDisbursementVouchers.map((v) => (
                      <tr key={v.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="p-3 font-mono font-bold text-[#1d5b96]">{v.voucherNumber}</td>
                        <td className="p-3 font-bold text-slate-900">{v.employeeName}</td>
                        <td className="p-3 text-slate-700">{v.expenseTitle}</td>
                        <td className="p-3 text-slate-500">{formatDate(v.approvalDate)}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">{formatCurrency(v.amount)}</td>
                        <td className="p-3 text-right">
                          <Link
                            to={`/accounts/vouchers/${v.id}`}
                            className="inline-flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm transition-all"
                          >
                            Disburse
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {data.pendingDisbursementVouchers && data.pendingDisbursementVouchers.length === 0 && (
            <div className="flex items-center gap-4 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-emerald-900 text-sm">All disbursements are up to date!</p>
                <p className="text-xs text-emerald-700 mt-0.5">No approved vouchers are waiting for payment settlement.</p>
              </div>
            </div>
          )}

          {/* Recently Approved Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Recently Approved Vouchers</h2>
                <p className="text-xs text-slate-500 mt-0.5">All authorized claims including disbursed and pending payment.</p>
              </div>
              <Link to="/accounts/vouchers" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1d5b96] hover:underline">
                <span>All Vouchers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <VoucherTable vouchers={data.recentApprovedVouchers} basePath="/accounts/vouchers" showEmployee />
          </div>
        </>
      )}
    </div>
  );
}
