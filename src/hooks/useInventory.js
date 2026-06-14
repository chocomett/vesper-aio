import { useState, useEffect } from 'react';
import { inventoryService } from '../services/inventoryService';

export function useInventory() {
  const [inventoryData, setInventoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const data = await inventoryService.getAll();
      // Ensure data is always an array to prevent .filter() errors on the UI
      setInventoryData(Array.isArray(data) ? data : []);
    } catch (err) {
      // Error sudah di-console.log di dalam apiClient
      setInventoryData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const addItem = async (formData) => {
    try {
      await inventoryService.create(formData);
      fetchInventory(); // Refresh data otomatis setelah berhasil nambah
      return true;
    } catch (err) {
      alert(err.message || "Gagal menambahkan barang!");
      return false;
    }
  };

  const updateItem = async (id, formData) => {
    try {
      await inventoryService.update(id, formData);
      fetchInventory();
      return true;
    } catch (err) {
      alert(err.message || "Gagal mengupdate barang!");
      return false;
    }
  };

  const deleteItem = async (id) => {
    try {
      await inventoryService.delete(id);
      fetchInventory();
      return true;
    } catch (err) {
      alert(err.message || "Gagal menghapus barang!");
      return false;
    }
  };

  return {
    inventoryData,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    fetchInventory
  };
}
