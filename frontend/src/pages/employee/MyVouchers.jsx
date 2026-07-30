import { useEffect, useState, useCallback } from 'react';
import { voucherApi } from '../../api/vouchers';
import VoucherTable from '../../components/VoucherTable';
import FilterBar from '../../components/FilterBar';
import Pagination from '../../components/Pagination';
import { Link } from 'react-router-dom';

export default function MyVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({ page: 1, sortBy: 'createdAt' });

  const load = useCallback(() => {
    voucherApi.mine(filters).then((res) => {
      setVouchers(res.data.vouchers);
      setPagination(res.data.pagination);
    });
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl font-bold text-ink-900">My Vouchers</h1>
        <Link
          to="/employee/create"
          className="px-4 py-2 bg-ink-900 text-white rounded-md text-sm font-medium hover:bg-ink-800 transition-colors focus-ring"
        >
          + New Voucher
        </Link>
      </div>
      <p className="text-ink-600 text-sm mb-6">Vouchers you've created. Draft vouchers can be edited or deleted.</p>

      <FilterBar filters={filters} onChange={setFilters} fields={['voucherNumber', 'status', 'category', 'dateRange', 'amountRange']} />
      <VoucherTable vouchers={vouchers} basePath="/employee/vouchers" />
      <Pagination pagination={pagination} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} />
    </div>
  );
}
