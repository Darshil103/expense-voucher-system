import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { voucherApi } from '../api/vouchers';
import { useAuth } from '../context/AuthContext';
import StatusStamp from '../components/StatusStamp';
import PrachayLogo from '../components/PrachayLogo';
import { formatCurrency, formatDate, fileUrl } from '../utils/format';
import {
  Printer,
  FileCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
  UserCheck,
  Send,
  AlertCircle,
  FileText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const DASHBOARD_PATH = {
  employee: '/employee/vouchers',
  director: '/director/vouchers',
  accounts: '/accounts/vouchers',
};

export default function VoucherDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [voucher, setVoucher] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [directorSignature, setDirectorSignature] = useState(null);

  // Accounts reimbursement settlement state
  const [reimbursementRef, setReimbursementRef] = useState('');
  const [showReimburseModal, setShowReimburseModal] = useState(false);

  function load() {
    voucherApi
      .getById(id)
      .then((res) => setVoucher(res.data.voucher))
      .catch((err) => {
        setError(err.response?.data?.message || 'Unable to load this voucher.');
      });
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleDelete() {
    if (!window.confirm('Delete this draft voucher? This action cannot be undone.')) return;
    setBusy(true);
    try {
      await voucherApi.remove(id);
      navigate(DASHBOARD_PATH[user.role]);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete voucher.');
      setBusy(false);
    }
  }

  async function handleSubmit() {
    setBusy(true);
    try {
      await voucherApi.submit(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit voucher.');
    } finally {
      setBusy(false);
    }
  }

  async function handleApprove() {
    if (!directorSignature && !voucher.directorSignature) {
      setError('Please upload your signature before approving.');
      return;
    }
    setBusy(true);
    try {
      await voucherApi.approve(id, { directorSignature });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to approve voucher.');
    } finally {
      setBusy(false);
    }
  }

  async function handleReject() {
    if (!rejectReason.trim()) {
      setError('A rejection reason is required.');
      return;
    }
    setBusy(true);
    try {
      await voucherApi.reject(id, rejectReason);
      load();
      setShowReject(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reject voucher.');
    } finally {
      setBusy(false);
    }
  }

  async function handleMarkReimbursed() {
    setBusy(true);
    try {
      const ref = reimbursementRef.trim() || `UTR-PSPL-${Math.floor(100000 + Math.random() * 900000)}`;
      await voucherApi.reimburse(id, { reimbursementRef: ref });
      load();
      setShowReimburseModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to record reimbursement.');
    } finally {
      setBusy(false);
    }
  }

  const handlePrint = () => {
    window.print();
  };

  if (error && !voucher) {
    return <p className="text-red-600 text-sm font-semibold p-4">{error}</p>;
  }
  if (!voucher) return <p className="text-slate-500 text-sm p-4">Loading voucher details...</p>;

  const isOwner = user.role === 'employee' && voucher.employeeId === user.id;
  const canEdit = isOwner && voucher.status === 'draft';
  const canSubmit = isOwner && voucher.status === 'draft';
  const canApproveReject = user.role === 'director' && voucher.status === 'pending_approval';
  const canReimburse = user.role === 'accounts' && voucher.status === 'approved' && !voucher.reimbursedAt;

  const isAdvance = voucher.voucherType === 'advance';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link
          to={DASHBOARD_PATH[user.role]}
          className="text-xs font-bold text-slate-500 hover:text-[#1d5b96] transition-colors"
        >
          ← Back to Voucher List
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs px-4 py-2 rounded-xl border border-slate-300 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4 text-[#1d5b96]" />
            Print Official PDF Voucher
          </button>
        </div>
      </div>

      {/* Visual Step-by-Step Audit Timeline Stepper */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm print:hidden">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Audit Workflow & Compliance Status
        </h3>
        <div className="grid grid-cols-4 gap-2 text-center relative">
          {/* Progress bar line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

          {/* Step 1: Created */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1d5b96] flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm mb-2">
              1
            </div>
            <span className="text-xs font-bold text-slate-800">Drafted</span>
            <span className="text-[10px] text-slate-400">{formatDate(voucher.createdAt)}</span>
          </div>

          {/* Step 2: Submitted */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm mb-2 ${
                voucher.submittedAt ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              2
            </div>
            <span className="text-xs font-bold text-slate-800">Submitted</span>
            <span className="text-[10px] text-slate-400">
              {voucher.submittedAt ? formatDate(voucher.submittedAt) : 'Pending'}
            </span>
          </div>

          {/* Step 3: Director Approved */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm mb-2 ${
                voucher.status === 'approved'
                  ? 'bg-[#f39c12] text-slate-900'
                  : voucher.status === 'rejected'
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              3
            </div>
            <span className="text-xs font-bold text-slate-800">
              {voucher.status === 'rejected' ? 'Rejected' : 'Director Approval'}
            </span>
            <span className="text-[10px] text-slate-400">
              {voucher.approvalDate ? formatDate(voucher.approvalDate) : 'Pending'}
            </span>
          </div>

          {/* Step 4: Disbursed */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm mb-2 ${
                voucher.reimbursedAt ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              4
            </div>
            <span className="text-xs font-bold text-slate-800">Disbursed</span>
            <span className="text-[10px] text-slate-400">
              {voucher.reimbursedAt ? formatDate(voucher.reimbursedAt) : 'Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Official Printable Voucher Document Container */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden font-sans print:border-none print:shadow-none">
        {/* Printable Official Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 print:bg-white print:text-slate-900 print:border-b print:border-slate-300">
          <div className="flex items-center gap-4">
            <PrachayLogo className="h-10" showText={true} />
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xs font-bold text-[#f39c12] uppercase tracking-widest mb-1">
              OFFICIAL EXPENSE VOUCHER
            </div>
            <div className="font-mono text-xl font-extrabold tracking-wider">{voucher.voucherNumber}</div>
            <div className="text-xs text-slate-400 mt-1">Voucher Date: {formatDate(voucher.voucherDate)}</div>
          </div>
        </div>

        {/* Voucher Status Banner & Type */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <StatusStamp status={voucher.status} />
            <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-[#1d5b96] rounded-full uppercase tracking-wider">
              {isAdvance ? '⚡ Advance Request' : '🧾 Reimbursement Claim'}
            </span>
          </div>

          {voucher.reimbursedAt && (
            <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Paid / Settlement Ref: {voucher.reimbursementRef}</span>
            </div>
          )}
        </div>

        {/* Form Data Metadata Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Employee Name
            </span>
            <span className="font-bold text-slate-900">{voucher.employeeName}</span>
            <span className="block text-xs text-slate-500">{voucher.employeeCode || 'EMP-PSPL'}</span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Department
            </span>
            <span className="font-bold text-slate-900">{voucher.departmentName}</span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Category
            </span>
            <span className="font-bold text-slate-900">{voucher.expenseCategory}</span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              {isAdvance ? 'Estimated Expense Date' : 'Expense / Receipt Date'}
            </span>
            <span className="font-bold text-slate-900">{formatDate(voucher.expenseDate)}</span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Total Amount
            </span>
            <span className="font-mono text-xl font-extrabold text-[#1d5b96]">
              {formatCurrency(voucher.amount)}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Submission Date
            </span>
            <span className="font-medium text-slate-700">
              {voucher.submittedAt ? formatDate(voucher.submittedAt) : 'Not Submitted'}
            </span>
          </div>
        </div>

        {/* Expense Title & Description */}
        <div className="px-6 sm:px-8 pb-6 space-y-3 border-t border-slate-100 pt-6">
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Expense Title</h4>
            <p className="text-base font-bold text-slate-900">{voucher.expenseTitle}</p>
          </div>

          {voucher.expenseDescription && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description & Justification</h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {voucher.expenseDescription}
              </p>
            </div>
          )}
        </div>

        {/* Line Items Table Breakdown if Present */}
        {voucher.lineItems && Array.isArray(voucher.lineItems) && voucher.lineItems.length > 0 && (
          <div className="px-6 sm:px-8 pb-6 border-t border-slate-100 pt-6">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Itemized Line Expense Breakdown
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Item Description</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {voucher.lineItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 text-slate-400 font-bold">{idx + 1}</td>
                      <td className="p-3 font-semibold text-slate-800">{item.description || 'Expense Line Item'}</td>
                      <td className="p-3 text-slate-500">{item.category || voucher.expenseCategory}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(item.amount || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Dual Signature Stamps & Digital QR Verification Verification Box */}
        <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Employee Signature */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Employee Signature
            </span>
            {voucher.employeeSignature ? (
              <img
                src={fileUrl(voucher.employeeSignature)}
                alt="Employee Signature"
                className="h-16 mx-auto object-contain p-1 border border-slate-100 rounded"
              />
            ) : (
              <p className="text-xs text-slate-400 italic py-4">No signature uploaded</p>
            )}
            <span className="text-[11px] font-semibold text-slate-700 block mt-2">{voucher.employeeName}</span>
          </div>

          {/* Director Signature */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Director Authorization
            </span>
            {voucher.directorSignature ? (
              <img
                src={fileUrl(voucher.directorSignature)}
                alt="Director Signature"
                className="h-16 mx-auto object-contain p-1 border border-slate-100 rounded"
              />
            ) : (
              <p className="text-xs text-slate-400 italic py-4">
                {voucher.status === 'rejected' ? 'Rejected by Director' : 'Pending Director Approval'}
              </p>
            )}
            <span className="text-[11px] font-semibold text-slate-700 block mt-2">
              {voucher.approvedBy ? 'Authorized Director' : 'Director Review'}
            </span>
          </div>

          {/* QR Verification Badge */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-2 font-mono text-[10px] font-bold tracking-tighter p-1 text-center leading-tight">
              PSPL VERIFIED
            </div>
            <span className="text-[10px] font-bold text-[#1d5b96] uppercase tracking-wider">
              Audit Code: {voucher.id.slice(0, 8)}
            </span>
          </div>
        </div>

        {/* Rejection Reason Alert if Rejected */}
        {voucher.status === 'rejected' && voucher.rejectionReason && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm">
            <strong className="block font-bold mb-1">Director Rejection Reason:</strong>
            <p className="text-xs leading-relaxed">{voucher.rejectionReason}</p>
          </div>
        )}

        {/* Executive Actions Footer (Director & Accounts Controls) */}
        <div className="p-6 bg-white border-t border-slate-200 print:hidden space-y-4">
          {/* Employee Edit / Submit / Delete Buttons */}
          <div className="flex flex-wrap gap-3">
            {canEdit && (
              <button
                onClick={() => navigate(`/employee/vouchers/${id}/edit`)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-all"
              >
                Edit Draft
              </button>
            )}
            {canEdit && (
              <button
                onClick={handleDelete}
                disabled={busy}
                className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 transition-all"
              >
                Delete Draft
              </button>
            )}
            {canSubmit && (
              <button
                onClick={handleSubmit}
                disabled={busy}
                className="px-6 py-2.5 bg-[#1d5b96] hover:bg-[#14426f] text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Submit for Director Approval
              </button>
            )}
          </div>

          {/* Director Approval Controls */}
          {canApproveReject && (
            <div className="p-5 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#f39c12]" />
                Director Approval Panel
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Attach Director Digital Signature Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setDirectorSignature(e.target.files[0])}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={busy}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Approve Voucher
                </button>
                <button
                  onClick={() => setShowReject((s) => !s)}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Reject Voucher
                </button>
              </div>

              {showReject && (
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Enter reason for rejection..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                  <button
                    onClick={handleReject}
                    disabled={busy}
                    className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all"
                  >
                    Confirm Rejection
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Accounts Settlement Action */}
          {canReimburse && (
            <div className="p-5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Accounts Payment Settlement
                </h4>
                <p className="text-xs text-slate-600">
                  This voucher is approved. Record payment disbursement / NEFT UTR reference.
                </p>
              </div>

              {!showReimburseModal ? (
                <button
                  onClick={() => setShowReimburseModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all shrink-0"
                >
                  Mark Disbursed / Paid
                </button>
              ) : (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="UTR / Bank Ref Number..."
                    value={reimbursementRef}
                    onChange={(e) => setReimbursementRef(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handleMarkReimbursed}
                    disabled={busy}
                    className="bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
