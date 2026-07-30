import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { voucherApi, dashboardApi } from '../../api/vouchers';
import { fileUrl } from '../../utils/format';
import {
  Calendar,
  DollarSign,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building2,
  FileText,
  HelpCircle,
  Tag,
} from 'lucide-react';

const CATEGORIES = [
  'Travel',
  'Meals',
  'Accommodation',
  'Office Supplies',
  'Client Entertainment',
  'Communication',
  'Training & Certification',
  'Software & Subscriptions',
  'Other',
];

export default function VoucherForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [voucherType, setVoucherType] = useState('reimbursement'); // reimbursement | advance
  const [form, setForm] = useState({
    departmentName: 'Engineering',
    expenseTitle: '',
    expenseDate: new Date().toISOString().split('T')[0],
    expenseCategory: CATEGORIES[0],
    expenseDescription: '',
    amount: '',
  });

  const [lineItems, setLineItems] = useState([
    { description: 'Primary Expense Item', category: CATEGORIES[0], amount: '' },
  ]);

  const [signature, setSignature] = useState(null);
  const [existingSignature, setExistingSignature] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [budgetInfo, setBudgetInfo] = useState(null);

  // Fetch real department budget data
  useEffect(() => {
    dashboardApi.budget().then((res) => {
      const depts = res.data.departments || [];
      // Build a map for quick lookup
      const map = {};
      depts.forEach((d) => { map[d.name] = d; });
      setBudgetInfo({ map, monthly: res.data.monthlyBudgetPerDept });
    }).catch(() => {});
  }, []);

  // Derive current dept budget stats
  const currentDeptBudget = budgetInfo
    ? (budgetInfo.map[form.departmentName] || { name: form.departmentName, spent: 0, budget: budgetInfo.monthly, utilizationPct: 0 })
    : null;

  useEffect(() => {
    if (isEdit) {
      voucherApi.getById(id).then((res) => {
        const v = res.data.voucher;
        setVoucherType(v.voucherType || 'reimbursement');
        setForm({
          departmentName: v.departmentName,
          expenseTitle: v.expenseTitle,
          expenseDate: v.expenseDate,
          expenseCategory: v.expenseCategory,
          expenseDescription: v.expenseDescription || '',
          amount: v.amount,
        });
        if (v.lineItems && Array.isArray(v.lineItems) && v.lineItems.length > 0) {
          setLineItems(v.lineItems);
        }
        setExistingSignature(v.employeeSignature);
      });
    }
  }, [id, isEdit]);

  function updateForm(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // Handle Multi-Line Items & Auto Total calculation
  const handleLineItemChange = (index, field, value) => {
    const updated = [...lineItems];
    updated[index][field] = value;
    setLineItems(updated);

    const total = updated.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    if (total > 0) {
      setForm((f) => ({ ...f, amount: total.toFixed(2) }));
    }
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', category: form.expenseCategory, amount: '' }]);
  };

  const removeLineItem = (index) => {
    if (lineItems.length === 1) return;
    const updated = lineItems.filter((_, i) => i !== index);
    setLineItems(updated);
    const total = updated.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    setForm((f) => ({ ...f, amount: total > 0 ? total.toFixed(2) : '' }));
  };

  // Simulated AI Bill Receipt OCR Scanner
  const simulateReceiptScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (voucherType === 'advance') {
        setForm((f) => ({
          ...f,
          expenseTitle: 'Flight & Hotel Booking for Mumbai Client Visit',
          amount: '18500.00',
          expenseCategory: 'Travel',
          expenseDescription: 'Estimated travel and accommodation for Q3 Strategy Meet.',
        }));
        setLineItems([
          { description: 'Roundtrip Flight (DEL-BOM)', category: 'Travel', amount: '12500' },
          { description: 'Hotel Stay (2 Nights)', category: 'Accommodation', amount: '6000' },
        ]);
      } else {
        setForm((f) => ({
          ...f,
          expenseTitle: 'Team Working Lunch & Refreshments',
          amount: '3450.00',
          expenseCategory: 'Meals',
          expenseDescription: 'Client project milestone celebration team meal receipt attached.',
        }));
        setLineItems([
          { description: 'Restaurant Bill #PSPL-9941', category: 'Meals', amount: '3450' },
        ]);
      }
    }, 1200);
  };

  async function handleSave(e, submitAfter = false) {
    e.preventDefault();
    setError('');

    if (!form.expenseTitle || !form.amount || parseFloat(form.amount) <= 0) {
      return setError('Please provide a valid Expense Title and Amount.');
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        voucherType,
        lineItems: JSON.stringify(lineItems),
        employeeSignature: signature,
      };

      let voucherId = id;
      if (isEdit) {
        await voucherApi.update(id, payload);
      } else {
        if (!signature) {
          setError('Employee signature is mandatory before submission.');
          setLoading(false);
          return;
        }
        const res = await voucherApi.create(payload);
        voucherId = res.data.voucher.id;
      }

      if (submitAfter) {
        await voucherApi.submit(voucherId);
      }
      navigate('/employee/vouchers');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save voucher. Please check inputs.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {isEdit ? 'Edit Expense Voucher' : 'New Voucher Request'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create past expense reimbursements or request advance funds for upcoming operational expenses.
        </p>
      </div>

      {/* Voucher Type Selector (Reimbursement vs Advance Request) */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setVoucherType('reimbursement')}
          className={`flex items-center justify-center gap-3 p-4 rounded-xl text-sm font-semibold transition-all ${
            voucherType === 'reimbursement'
              ? 'bg-[#1d5b96] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-5 h-5 text-[#f39c12]" />
          <div className="text-left">
            <div className="font-bold">Expense Reimbursement</div>
            <div className="text-[11px] opacity-80 font-normal">Past/Current expense with bill proof</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setVoucherType('advance')}
          className={`flex items-center justify-center gap-3 p-4 rounded-xl text-sm font-semibold transition-all ${
            voucherType === 'advance'
              ? 'bg-[#1d5b96] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-5 h-5 text-[#f39c12]" />
          <div className="text-left">
            <div className="font-bold">Advance Expense Request</div>
            <div className="text-[11px] opacity-80 font-normal">Future date request before incurring expense</div>
          </div>
        </button>
      </div>

      {/* Department Budget Warning Meter */}
      {currentDeptBudget && (
        <div className={`border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          currentDeptBudget.utilizationPct >= 90 ? 'bg-red-50/80 border-red-200/80' :
          currentDeptBudget.utilizationPct >= 70 ? 'bg-amber-50/80 border-amber-200/80' :
          'bg-blue-50/80 border-blue-200/80'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl shrink-0 ${
              currentDeptBudget.utilizationPct >= 90 ? 'bg-red-100 text-red-600' :
              currentDeptBudget.utilizationPct >= 70 ? 'bg-amber-100 text-amber-700' :
              'bg-blue-100 text-[#1d5b96]'
            }`}>
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-xs font-bold uppercase tracking-wider ${
                currentDeptBudget.utilizationPct >= 90 ? 'text-red-700' :
                currentDeptBudget.utilizationPct >= 70 ? 'text-amber-700' :
                'text-[#1d5b96]'
              }`}>
                {currentDeptBudget.name} Department Budget
              </div>
              <div className="text-sm text-slate-600 font-medium">
                Monthly Budget: <strong>₹{(currentDeptBudget.budget / 100000).toFixed(0)} Lakh</strong> · Utilized:{' '}
                <strong>{new Intl.NumberFormat('en-IN', {style:'currency',currency:'INR',maximumFractionDigits:0}).format(currentDeptBudget.spent)} ({currentDeptBudget.utilizationPct}%)</strong>
              </div>
              {currentDeptBudget.utilizationPct >= 90 && (
                <div className="text-[11px] font-bold text-red-600 mt-0.5">⚠ Budget near limit — this submission may require Finance approval.</div>
              )}
            </div>
          </div>
          <div className="w-full sm:w-48 bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                currentDeptBudget.utilizationPct >= 90 ? 'bg-red-500' :
                currentDeptBudget.utilizationPct >= 70 ? 'bg-amber-500' :
                'bg-[#1d5b96]'
              }`}
              style={{ width: `${currentDeptBudget.utilizationPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Smart Receipt Auto-Fill Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-6 h-6 text-[#f39c12] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-slate-900">AI Bill OCR & Smart Auto-Fill</h4>
            <p className="text-xs text-slate-600">
              Upload your receipt or quotation image to automatically extract amounts, date, and line item details.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={simulateReceiptScan}
          disabled={isScanning}
          className="inline-flex items-center gap-2 bg-[#f39c12] hover:bg-[#d98205] text-slate-900 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0"
        >
          {isScanning ? 'Scanning Receipt...' : 'Scan Receipt / Auto-Fill'}
        </button>
      </div>

      {/* Form Container */}
      <form onSubmit={(e) => handleSave(e, false)} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Department *
            </label>
            <input
              type="text"
              required
              value={form.departmentName}
              onChange={(e) => updateForm('departmentName', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#1d5b96] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Category *
            </label>
            <select
              value={form.expenseCategory}
              onChange={(e) => updateForm('expenseCategory', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#1d5b96] focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Expense Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Flight fare for Mumbai client meet"
              value={form.expenseTitle}
              onChange={(e) => updateForm('expenseTitle', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1d5b96] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              {voucherType === 'advance' ? 'Estimated Expense Date (Future Date Allowed) *' : 'Receipt / Expense Date *'}
            </label>
            <input
              type="date"
              required
              value={form.expenseDate}
              onChange={(e) => updateForm('expenseDate', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#1d5b96] focus:outline-none"
            />
          </div>
        </div>

        {/* Multi-Line Item Expense Breakdown */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#1d5b96]" />
              Expense Breakdown Line Items
            </h3>
            <button
              type="button"
              onClick={addLineItem}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1d5b96] hover:text-[#14426f] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Line Item
            </button>
          </div>

          <div className="space-y-3">
            {lineItems.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="text"
                  placeholder="Item description..."
                  value={item.description}
                  onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                  className="flex-1 w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#1d5b96] focus:outline-none"
                />
                <select
                  value={item.category || form.expenseCategory}
                  onChange={(e) => handleLineItemChange(index, 'category', e.target.value)}
                  className="w-full sm:w-40 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#1d5b96] focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="relative w-full sm:w-36">
                  <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={item.amount}
                    onChange={(e) => handleLineItemChange(index, 'amount', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg pl-6 pr-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-[#1d5b96] focus:outline-none"
                  />
                </div>
                {lineItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLineItem(index)}
                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Total Amount & Description */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Expense Description / Justification
            </label>
            <textarea
              rows={3}
              placeholder="Provide context or project code details..."
              value={form.expenseDescription}
              onChange={(e) => updateForm('expenseDescription', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1d5b96] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Total Amount (₹) *
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold">
                ₹
              </div>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => updateForm('amount', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-4 py-2.5 text-lg font-extrabold text-slate-900 focus:ring-2 focus:ring-[#1d5b96] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Signature Upload */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Employee Signature Image {isEdit ? '(Optional to replace)' : '*'}
          </label>

          {existingSignature && !signature && (
            <div className="mb-3 flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <img src={fileUrl(existingSignature)} alt="Signature" className="h-10 border bg-white rounded p-1" />
              <span className="text-xs text-emerald-800 font-semibold">Signature already attached</span>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSignature(e.target.files[0])}
            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#1d5b96] hover:file:bg-blue-100"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/employee/vouchers')}
            className="w-full sm:w-auto text-slate-600 hover:text-slate-900 font-semibold text-sm px-6 py-2.5 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm px-6 py-2.5 rounded-xl border border-slate-300 transition-all"
          >
            Save as Draft
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={(e) => handleSave(e, true)}
            className="w-full sm:w-auto bg-[#1d5b96] hover:bg-[#14426f] text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Submit for Approval
          </button>
        </div>
      </form>
    </div>
  );
}
