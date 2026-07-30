import client from './client';

export const authApi = {
  login: (payload) => client.post('/auth/login', payload).then((r) => r.data),
  register: (payload) => client.post('/auth/register', payload).then((r) => r.data),
  getMe: () => client.get('/auth/me').then((r) => r.data),
};
