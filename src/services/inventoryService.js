import { apiClient } from './apiClient';

/**
 * Service khusus untuk mengurus data Inventaris.
 * Semua alamat rute (endpoint) terkait inventaris dikumpulkan di sini.
 */
export const inventoryService = {
  // Mengambil semua daftar barang
  getAll: () => {
    return apiClient('/inventaris');
  },

  // Menambah barang baru
  create: (itemData) => {
    return apiClient('/inventaris', {
      method: 'POST',
      body: JSON.stringify(itemData)
    });
  },

  // Mengupdate barang
  update: (id, itemData) => {
    return apiClient(`/inventaris/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData)
    });
  },

  // Menghapus barang
  delete: (id) => {
    return apiClient(`/inventaris/${id}`, {
      method: 'DELETE'
    });
  }
};
