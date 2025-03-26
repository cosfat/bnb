"use client";

import { useState } from 'react';

export default function Settings({ settings, onUpdate }) {
  const [workerPayAmount, setWorkerPayAmount] = useState(settings?.worker_pay_amount || 0);
  const [euroRate, setEuroRate] = useState(settings?.euro_rate || 32.50);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          worker_pay_amount: workerPayAmount,
          euro_rate: euroRate
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ayarlar güncellenirken bir hata oluştu');
      }

      const updatedSettings = await response.json();
      onUpdate(updatedSettings);
      setSuccess(true);
      
      // 3 saniye sonra başarı mesajını kaldır
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Ayarlar</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Çalışan Ödeme Tutarı */}
        <div>
          <label htmlFor="workerPayAmount" className="block text-sm font-medium text-gray-700">
            Çalışan Başına Rezervasyon Ücreti (₺)
          </label>
          <div className="mt-1">
            <input
              type="number"
              step="0.01"
              id="workerPayAmount"
              value={workerPayAmount}
              onChange={(e) => setWorkerPayAmount(e.target.value)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        {/* Euro Kuru */}
        <div>
          <label htmlFor="euroRate" className="block text-sm font-medium text-gray-700">
            Euro/TL Kuru
          </label>
          <div className="mt-1">
            <input
              type="number"
              step="0.01"
              id="euroRate"
              value={euroRate}
              onChange={(e) => setEuroRate(e.target.value)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Hata</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Başarı Mesajı */}
        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Ayarlar başarıyla güncellendi
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Gönder Butonu */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {isLoading ? 'Güncelleniyor...' : 'Ayarları Güncelle'}
          </button>
        </div>
      </form>
    </div>
  );
} 