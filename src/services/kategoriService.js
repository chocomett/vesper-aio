import { apiClient } from './apiClient';

export const kategoriService = {
  getAll: () => apiClient('/kategori'),
  create: (nama) => apiClient('/kategori', { method: 'POST', body: JSON.stringify({ nama }) }),
  delete: (id) => apiClient(`/kategori/${id}`, { method: 'DELETE' }),
};
