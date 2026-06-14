/**
 * Global API Client
 * Berfungsi sebagai "satpam" sentral untuk semua fetch API.
 * Di sini kita bisa mengatur URL dasar, headers otomatis, dan error handling global.
 */

const BASE_URL = '/api';

export const apiClient = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // Nanti kalau ada token login, bisa taruh di sini:
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Parse response body as JSON
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // Jika server mengembalikan status error (400, 500)
      throw new Error(data?.error || 'Terjadi kesalahan pada server');
    }

    return data;
  } catch (error) {
    // Tangkap error jaringan (misal: internet mati) atau lemparan dari blok if di atas
    console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error.message);
    throw error;
  }
};
