"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateReservation } from "../../hooks/useReservations";
import { useHouses } from "../../hooks/useHouses";
import { useWorkers } from "../../hooks/useWorkers";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function NewReservationPage() {
  const router = useRouter();
  const { mutate: createReservation, isPending } = useCreateReservation();
  const { data: houses, isLoading: housesLoading } = useHouses();
  const { data: workers, isLoading: workersLoading } = useWorkers();
  
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    house_id: "",
    worker_id: "",
    start: new Date().toISOString().split('T')[0],
    finish: "",
    info: ""
  });
  
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Rezervasyon adı zorunludur";
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
    
    if (!formData.worker_id) {
      newErrors.worker_id = "Çalışan seçimi zorunludur";
    }
    
    if (!formData.start) {
      newErrors.start = "Başlangıç tarihi zorunludur";
    }
    
    if (!formData.finish) {
      newErrors.finish = "Bitiş tarihi zorunludur";
    } else if (formData.start && new Date(formData.finish) < new Date(formData.start)) {
      newErrors.finish = "Bitiş tarihi başlangıç tarihinden önce olamaz";
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
    
    const reservationData = {
      ...formData,
      price: Number(formData.price),
      house_id: Number(formData.house_id),
      worker_id: Number(formData.worker_id),
      start: formData.start ? new Date(formData.start).toISOString() : null,
      finish: formData.finish ? new Date(formData.finish).toISOString() : null,
    };
    
    createReservation(reservationData, {
      onSuccess: () => {
        router.push("/reservations");
      },
      onError: (error) => {
        console.error("Rezervasyon oluşturma hatası:", error);
        alert("Rezervasyon oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    });
  };
  
  if (housesLoading || workersLoading) {
    return <div className="container mx-auto p-4">Yükleniyor...</div>;
  }
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-2 sm:py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold">Yeni Rezervasyon Ekle</h1>
            <Link href="/reservations" className="text-blue-500 hover:text-blue-700 text-sm sm:text-base">
              Geri Dön
            </Link>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="mb-3 sm:mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Rezervasyon Adı
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm sm:text-base ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Rezervasyon adını girin"
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
                placeholder="Rezervasyon fiyatını girin"
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
            
            <div className="mb-3 sm:mb-4">
              <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                id="start"
                name="start"
                value={formData.start}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm sm:text-base ${errors.start ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.start && <p className="mt-1 text-xs text-red-500">{errors.start}</p>}
            </div>
            
            <div className="mb-3 sm:mb-4">
              <label htmlFor="finish" className="block text-sm font-medium text-gray-700 mb-1">
                Bitiş Tarihi
              </label>
              <input
                type="date"
                id="finish"
                name="finish"
                value={formData.finish}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm sm:text-base ${errors.finish ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.finish && <p className="mt-1 text-xs text-red-500">{errors.finish}</p>}
            </div>
            
            <div className="mb-4 sm:mb-6">
              <label htmlFor="info" className="block text-sm font-medium text-gray-700 mb-1">
                Ek Bilgiler
              </label>
              <textarea
                id="info"
                name="info"
                value={formData.info}
                onChange={handleChange}
                rows="3"
                className={`w-full px-3 py-2 border rounded-md text-sm sm:text-base ${errors.info ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Varsa ek bilgileri girin"
              />
              {errors.info && <p className="mt-1 text-xs text-red-500">{errors.info}</p>}
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className={`px-4 py-2 text-sm sm:text-base font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isPending ? 'Oluşturuluyor...' : 'Rezervasyon Oluştur'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 