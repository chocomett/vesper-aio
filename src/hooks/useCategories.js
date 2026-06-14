import { useState, useEffect } from 'react';
import { kategoriService } from '../services/kategoriService';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await kategoriService.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (nama) => {
    try {
      await kategoriService.create(nama);
      fetchCategories();
      return true;
    } catch (err) {
      alert(err.message || "Gagal menambahkan kategori!");
      return false;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await kategoriService.delete(id);
      fetchCategories();
      return true;
    } catch (err) {
      alert(err.message || "Gagal menghapus kategori!");
      return false;
    }
  };

  return {
    categories,
    isLoading,
    addCategory,
    deleteCategory,
    fetchCategories
  };
}
