"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useSettings, useUpdateSettings } from "../hooks/useSettings";

export default function SettingsPage() {
  const { data: settings, isLoading, error, refetch } = useSettings();
  const updateSettingsMutation = useUpdateSettings();
  
  const [workerPayAmount, setWorkerPayAmount] = useState("");
  const [euroRate, setEuroRate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });
  
  useEffect(() => {
    if (settings) {
      console.log("Ayarlar yüklendi:", settings);
      if (settings.worker_pay_amount) {
        setWorkerPayAmount(settings.worker_pay_amount.toString());
      }
      if (settings.euro_rate) {
        setEuroRate(settings.euro_rate.toString());
      }
    }
  }, [settings]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage({ type: "", text: "" });
    
    try {
      console.log("Ayarlar gönderiliyor:", { 
        worker_pay_amount: workerPayAmount,
        euro_rate: euroRate
      });
      
      const updatedSettings = await updateSettingsMutation.mutateAsync({
        worker_pay_amount: workerPayAmount,
        euro_rate: euroRate
      });
      
      console.log("Güncellenmiş ayarlar:", updatedSettings);
      // Güncellenmiş değerleri doğrudan state'e yaz
      setWorkerPayAmount(updatedSettings.worker_pay_amount.toString());
      setEuroRate(updatedSettings.euro_rate.toString());
      
      // Başarı mesajı göster
      setSaveMessage({ 
        type: "success", 
        text: "Ayarlar başarıyla kaydedildi." 
      });
      
      // Tüm ayarları yenile
      refetch();
      
      setTimeout(() => {
        setSaveMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Ayar güncelleme hatası:", error);
      setSaveMessage({ 
        type: "error", 
        text: `Hata oluştu: ${error.message}` 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Ayarlar</h1>
          <p>Yükleniyor...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Ayarlar</h1>
          <p className="text-red-500">Hata: {error.message}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Ayarlar</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Genel Ayarlar</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Mesai Bedeli (TL)
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={workerPayAmount}
                  onChange={(e) => setWorkerPayAmount(e.target.value)}
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Bu değer, çalışanların karşıladığı her rezervasyon için alacağı ücrettir.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Euro/TL Kuru
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={euroRate}
                  onChange={(e) => setEuroRate(e.target.value)}
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Bu değer, Euro cinsinden fiyatları TL'ye çevirmek için kullanılacaktır.
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  isSaving ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSaving}
              >
                {isSaving ? "Kaydediliyor..." : "Kaydet"}
              </button>
              
              {saveMessage.text && (
                <span 
                  className={`ml-4 ${
                    saveMessage.type === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {saveMessage.text}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 