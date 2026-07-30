export default function FilterBar({ filters, onChange, fields }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value, page: 1 });
  }

  return (
    <div className="bg-white border border-paper-200 rounded-lg p-4 mb-5 flex flex-wrap gap-3 items-end">
      {fields.includes('voucherNumber') && (
        <div>
          <label className="block text-xs text-ink-600 mb-1">Voucher #</label>
          <input
            value={filters.voucherNumber || ''}
            onChange={(e) => set('voucherNumber', e.target.value)}
            className="border border-paper-200 rounded-md px-3 py-1.5 text-sm w-36 focus-ring"
          />
        </div>
      )}
      {fields.includes('employeeName') && (
        <div>
          <label className="block text-xs text-ink-600 mb-1">Employee</label>
          <input
            value={filters.employeeName || ''}
            onChange={(e) => set('employeeName', e.target.value)}
            className="border border-paper-200 rounded-md px-3 py-1.5 text-sm w-36 focus-ring"
          />
        </div>
      )}
      {fields.includes('department') && (
        <div>
          <label className="block text-xs text-ink-600 mb-1">Department</label>
          <input
            value={filters.department || ''}
            onChange={(e) => set('department', e.target.value)}
            className="border border-paper-200 rounded-md px-3 py-1.5 text-sm w-32 focus-ring"
          />
        </div>
      )}
      {fields.includes('category') && (
        <div>
          <label className="block text-xs text-ink-600 mb-1">Category</label>
          <input
            value={filters.category || ''}
            onChange={(e) => set('category', e.target.value)}
            className="border border-paper-200 rounded-md px-3 py-1.5 text-sm w-32 focus-ring"
          />
        </div>
      )}
      {fields.includes('status') && (
        <div>
          <label className="block text-xs text-ink-600 mb-1">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => set('status', e.target.value)}
            className="border border-paper-200 rounded-md px-3 py-1.5 text-sm focus-ring"
          >
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      )}
      {fields.includes('dateRange') && (
        <>
          <div>
            <label className="block text-xs text-ink-600 mb-1">From</label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => set('startDate', e.target.value)}
              className="border border-paper-200 rounded-md px-3 py-1.5 text-sm focus-ring"
            />
          </div>
          <div>
            <label className="block text-xs text-ink-600 mb-1">To</label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => set('endDate', e.target.value)}
              className="border border-paper-200 rounded-md px-3 py-1.5 text-sm focus-ring"
            />
          </div>
        </>
      )}
      {fields.includes('amountRange') && (
        <>
          <div>
            <label className="block text-xs text-ink-600 mb-1">Min ₹</label>
            <input
              type="number"
              value={filters.minAmount || ''}
              onChange={(e) => set('minAmount', e.target.value)}
              className="border border-paper-200 rounded-md px-3 py-1.5 text-sm w-24 focus-ring"
            />
          </div>
          <div>
            <label className="block text-xs text-ink-600 mb-1">Max ₹</label>
            <input
              type="number"
              value={filters.maxAmount || ''}
              onChange={(e) => set('maxAmount', e.target.value)}
              className="border border-paper-200 rounded-md px-3 py-1.5 text-sm w-24 focus-ring"
            />
          </div>
        </>
      )}
      <div>
        <label className="block text-xs text-ink-600 mb-1">Sort by</label>
        <select
          value={filters.sortBy || 'createdAt'}
          onChange={(e) => set('sortBy', e.target.value)}
          className="border border-paper-200 rounded-md px-3 py-1.5 text-sm focus-ring"
        >
          <option value="createdAt">Created</option>
          <option value="expenseDate">Expense Date</option>
          <option value="amount">Amount</option>
          <option value="status">Status</option>
        </select>
      </div>
      <button
        onClick={() => onChange({ page: 1, sortBy: filters.sortBy })}
        className="text-sm text-ink-600 hover:text-ink-900 underline underline-offset-2 mb-1.5"
      >
        Clear filters
      </button>
    </div>
  );
}
