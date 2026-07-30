import { useEffect, useState, useCallback } from 'react';
import { voucherApi } from '../../api/vouchers';
import VoucherTable from '../../components/VoucherTable';
import FilterBar from '../../components/FilterBar';
import Pagination from '../../components/Pagination';

export default function AllVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({ page: 1, sortBy: 'createdAt' });

  const load = useCallback(() => {
    voucherApi.all(filters).then((res) => {
      setVouchers(res.data.vouchers);
      setPagination(res.data.pagination);
    });
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-900 mb-1">All Vouchers</h1>
      <p className="text-ink-600 text-sm mb-6">Every voucher in the organization.</p>

      <FilterBar filters={filters} onChange={setFilters} fields={['voucherNumber', 'employeeName', 'department', 'category', 'status', 'dateRange', 'amountRange']} />
      <VoucherTable vouchers={vouchers} basePath="/director/vouchers" showEmployee />
      <Pagination pagination={pagination} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} />
    </div>
  );
}
