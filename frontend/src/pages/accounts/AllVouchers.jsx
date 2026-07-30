import { useEffect, useState, useCallback } from 'react';
import { voucherApi, dashboardApi } from '../../api/vouchers';
import VoucherTable from '../../components/VoucherTable';
import FilterBar from '../../components/FilterBar';
import Pagination from '../../components/Pagination';
import { Download } from 'lucide-react';

export default function AccountsAllVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({ page: 1, sortBy: 'createdAt' });

  const load = useCallback(() => {
    voucherApi.all(filters).then((res) => {
      setVouchers(res.data.vouchers);
      setPagination(res.data.pagination);
    });
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

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
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 mb-1">All Vouchers</h1>
          <p className="text-ink-600 text-sm">View-only access for reimbursement processing.</p>
        </div>
        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all self-start sm:self-center"
        >
          <Download className="w-4 h-4" />
          <span>Export All CSV</span>
        </button>
      </div>

      <FilterBar filters={filters} onChange={setFilters} fields={['voucherNumber', 'employeeName', 'department', 'category', 'status', 'dateRange', 'amountRange']} />
      <VoucherTable vouchers={vouchers} basePath="/accounts/vouchers" showEmployee />
      <Pagination pagination={pagination} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} />
    </div>
  );
}
