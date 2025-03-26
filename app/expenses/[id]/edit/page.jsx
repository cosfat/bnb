"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useExpense, useUpdateExpense, useDeleteExpense } from "../../../hooks/useExpenses";
import { useHouses } from "../../../hooks/useHouses";
import { useCategories } from "../../../hooks/useCategories";
import { useWorkers } from "../../../hooks/useWorkers";
import Navbar from "../../../components/Navbar";
import Link from "next/link";
import { use } from "react";

export default function EditExpensePage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { data: expense, isLoading: expenseLoading } = useExpense(id);
  const { mutate: updateExpense, isPending } = useUpdateExpense();
  const { mutate: deleteExpense, isPending: isDeleting } = useDeleteExpense();
  const { data: houses, isLoading: housesLoading } = useHouses();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: workers, isLoading: workersLoading } = useWorkers();
  
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    house_id: "",
    category_id: "",
    worker_id: "",
    created_at: "",
  });
  
  const [errors, setErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Gider verisi yüklendiğinde form alanlarını doldur
  useEffect(() => {
    if (expense) {
      // Tarih formatını yyyy-mm-dd şekline çevir (HTML date input için)
      let formattedDate = "";
      if (expense.created_at) {
        const date = new Date(expense.created_at);
        formattedDate = date.toISOString().split('T')[0];
      }

      setFormData({
        name: expense.name || "",
        price: expense.price?.toString() || "",
        house_id: expense.house_id?.toString() || "",
        category_id: expense.category_id?.toString() || "",
        worker_id: expense.worker_id?.toString() || "",
        created_at: formattedDate,
      });
    }
  }, [expense]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Gider adı zorunludur";
    }
    
    if (!formData.price) {
      newErrors.price = "Fiyat zorunludur";
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "Geçerli bir fiyat giriniz";
    } else if (Number(formData.price) > 999999.99) {
      newErrors.price = "Maksimum fiyat değeri 999999.99 olabilir";
    }
    
    if (!formData.house_id) {
      newErrors.house_id = "Ev seçimi zorunludur";
    }
    
    if (!formData.category_id) {
      newErrors.category_id = "Kategori seçimi zorunludur";
    }
    
    if (!formData.worker_id) {
      newErrors.worker_id = "Çalışan seçimi zorunludur";
    }

    if (!formData.created_at) {
      newErrors.created_at = "Tarih zorunludur";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const expenseData = {
      ...formData,
      price: Number(formData.price),
      house_id: Number(formData.house_id),
      category_id: Number(formData.category_id),
      worker_id: Number(formData.worker_id),
      created_at: formData.created_at ? new Date(formData.created_at).toISOString() : null,
    };
    
    updateExpense(
      { id, data: expenseData },
      {
        onSuccess: () => {
          router.push("/expenses");
        },
        onError: (error) => {
          console.error("Gider güncelleme hatası:", error);
          alert("Gider güncellenirken bir hata oluştu. Lütfen tekrar deneyin.");
        }
      }
    );
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteExpense(id, {
      onSuccess: () => {
        router.push("/expenses");
      },
      onError: (error) => {
        console.error("Gider silme hatası:", error);
        alert("Gider silinirken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    });
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };
  
  if (expenseLoading || housesLoading || categoriesLoading || workersLoading) {
    return <div className="container mx-auto p-4">Yükleniyor...</div>;
  }
  
  if (!expense) {
    return <div className="container mx-auto p-4">Gider bulunamadı.</div>;
  }
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-2 sm:py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold">Gider Düzenle</h1>
            <Link href="/expenses" className="text-blue-500 hover:text-blue-700 text-sm sm:text-base">
              Geri Dön
            </Link>
          </div>
          
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                <h3 className="text-lg font-bold mb-4">Silme Onayı</h3>
                <p className="mb-4">Bu gideri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={cancelDelete}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    className="px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Siliniyor...' : 'Evet, Sil'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="mb-3 sm:mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Gider Adı
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm sm:text-base ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Gider adını girin"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
            
            <div className="mb-3 sm:mb-4">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Fiyat
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm sm:text-base ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Gider fiyatını girin"
                min="0"
                max="999999.99"
                step="0.01"
              />
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
            </div>
            
            <div className="mb-3 sm:mb-4">
              <label htmlFor="house_id" className="block text-sm font-medium text-gray-700 mb-1">
                Ev
              </label>
              <div className="relative">
                <select
                  id="house_id"
                  name="house_id"
                  value={formData.house_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border appearance-none rounded-md text-sm sm:text-base ${errors.house_id ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Ev Seçin</option>
                  {houses?.map((house) => (
                    <option key={house.id} value={house.id}>
                      {house.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              {errors.house_id && <p className="mt-1 text-xs text-red-500">{errors.house_id}</p>}
            </div>
            
            <div className="mb-3 sm:mb-4">
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <div className="relative">
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border appearance-none rounded-md text-sm sm:text-base ${errors.category_id ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Kategori Seçin</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              {errors.category_id && <p className="mt-1 text-xs text-red-500">{errors.category_id}</p>}
            </div>
            
            <div className="mb-3 sm:mb-4">
              <label htmlFor="created_at" className="block text-sm font-medium text-gray-700 mb-1">
                Tarih
              </label>
              <input
                type="date"
                id="created_at"
                name="created_at"
                value={formData.created_at}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm sm:text-base ${errors.created_at ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.created_at && <p className="mt-1 text-xs text-red-500">{errors.created_at}</p>}
            </div>
            
            <div className="mb-4 sm:mb-6">
              <label htmlFor="worker_id" className="block text-sm font-medium text-gray-700 mb-1">
                Çalışan
              </label>
              <div className="relative">
                <select
                  id="worker_id"
                  name="worker_id"
                  value={formData.worker_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border appearance-none rounded-md text-sm sm:text-base ${errors.worker_id ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Çalışan Seçin</option>
                  {workers?.map((worker) => (
                    <option key={worker.id} value={worker.id}>
                      {worker.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              {errors.worker_id && <p className="mt-1 text-xs text-red-500">{errors.worker_id}</p>}
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-2 text-xs sm:text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? 'Siliniyor...' : 'Sil'}
              </button>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => router.push("/expenses")}
                  className="px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className={`px-3 py-2 text-xs sm:text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isPending ? 'Güncelleniyor...' : 'Güncelle'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 