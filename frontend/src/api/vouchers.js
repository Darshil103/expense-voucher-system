import client from './client';

function toFormData(payload) {
  const fd = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') fd.append(key, value);
  });
  return fd;
}

export const voucherApi = {
  create: (payload) =>
    client
      .post('/vouchers', toFormData(payload), { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
  update: (id, payload) =>
    client
      .put(`/vouchers/${id}`, toFormData(payload), { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
  remove: (id) => client.delete(`/vouchers/${id}`).then((r) => r.data),
  submit: (id) => client.post(`/vouchers/${id}/submit`).then((r) => r.data),
  approve: (id, payload) =>
    client
      .post(`/vouchers/${id}/approve`, toFormData(payload || {}), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),
  reject: (id, rejectionReason) =>
    client.post(`/vouchers/${id}/reject`, { rejectionReason }).then((r) => r.data),
  mine: (params) => client.get('/vouchers/mine', { params }).then((r) => r.data),
  getMyVouchers: (params) => client.get('/vouchers/mine', { params }).then((r) => r.data),
  all: (params) => client.get('/vouchers', { params }).then((r) => r.data),
  pending: (params) => client.get('/vouchers/pending', { params }).then((r) => r.data),
  getPendingApprovals: (params) => client.get('/vouchers/pending', { params }).then((r) => r.data),
  getById: (id) => client.get(`/vouchers/${id}`).then((r) => r.data),
  reimburse: (id, data) => client.post(`/vouchers/${id}/reimburse`, data).then((r) => r.data),
};

export const dashboardApi = {
  employee: () => client.get('/dashboard/employee').then((r) => r.data),
  director: () => client.get('/dashboard/director').then((r) => r.data),
  accounts: () => client.get('/dashboard/accounts').then((r) => r.data),
  budget: () => client.get('/dashboard/budget').then((r) => r.data),
  exportCsvUrl: () => {
    const token = localStorage.getItem('accessToken');
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    return `${base}/dashboard/export-csv?_token=${token}`;
  },
};
