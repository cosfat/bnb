"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReservations } from "../hooks/useReservations";
import { useAuth } from "../hooks/useAuth";
import { useSettings } from "../hooks/useSettings";
import Navbar from "../components/Navbar";

export default function ReservationsPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: reservations, isLoading: reservationsLoading, error: reservationsError } = useReservations();
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [filteredByMonthReservations, setFilteredByMonthReservations] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalAmountInEuro, setTotalAmountInEuro] = useState(0);
  
  useEffect(() => {
    if (reservations && settings) {
      const filtered = reservations.filter((rezervasyon) => {
        if (!rezervasyon.start) return false;
        const date = new Date(rezervasyon.start);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });
      setFilteredByMonthReservations(filtered);
      
      // Toplam tutarı hesapla
      const total = filtered.reduce((sum, rezervasyon) => sum + Number(rezervasyon.price || 0), 0);
      setTotalAmount(total);
      
      // Euro cinsinden toplam tutarı hesapla
      const euroRate = Number(settings?.euro_rate || 32.50);
      setTotalAmountInEuro(total / euroRate);
    }
  }, [reservations, settings, currentMonth, currentYear]);

  const filteredReservations = filteredByMonthReservations?.filter(
    (rezervasyon) =>
      rezervasyon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rezervasyon.house.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (reservationsLoading || settingsLoading) {
    return <div className="container mx-auto p-4">Yükleniyor...</div>;
  }

  if (reservationsError) {
    return <div className="container mx-auto p-4">Hata: {reservationsError.message}</div>;
  }

  // Ay adını getiren fonksiyon
  const getMonthName = (month) => {
    const date = new Date();
    date.setMonth(month);
    return date.toLocaleString('tr-TR', { month: 'long' });
  };

  // Önceki aya geçme fonksiyonu
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Sonraki aya geçme fonksiyonu
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleRowClick = (id) => {
    if (currentUser?.isAdmin) {
      router.push(`/reservations/${id}/edit`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-2 sm:p-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Rezervasyonlar</h1>
        
        <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Ara..."
              className="border rounded p-1 sm:p-2 w-full sm:w-64 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={goToPreviousMonth}
              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm"
            >
              &lt;
            </button>
            <span className="font-semibold text-sm">
              {getMonthName(currentMonth)} {currentYear}
            </span>
            <button 
              onClick={goToNextMonth}
              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm"
            >
              &gt;
            </button>
          </div>
          
          {currentUser?.isAdmin && (
            <Link href="/reservations/new" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded text-sm">
              Yeni Rezervasyon
            </Link>
          )}
        </div>
        
        <div className="mb-3 sm:mb-4 bg-green-50 p-2 sm:p-3 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
            <span className="font-semibold text-green-700 text-xs sm:text-sm">
              {getMonthName(currentMonth)} {currentYear} Ayı Toplam Gelir:
            </span>
            <div className="flex flex-col items-end">
              <span className="text-base sm:text-lg font-bold text-green-800">
                {totalAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </span>
              <span className="text-sm font-semibold text-green-600">
                {totalAmountInEuro.toLocaleString('tr-TR', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-1 px-1 sm:py-2 sm:px-2 border">Adı</th>
                <th className="py-1 px-1 sm:py-2 sm:px-2 border">Ev</th>
                <th className="py-1 px-1 sm:py-2 sm:px-2 border">Başlangıç</th>
                <th className="py-1 px-1 sm:py-2 sm:px-2 border">Bitiş</th>
                <th className="py-1 px-1 sm:py-2 sm:px-2 border">Fiyat</th>
                <th className="py-1 px-1 sm:py-2 sm:px-2 border">Çalışan</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.length > 0 ? (
                filteredReservations.map((rezervasyon) => {
                  const priceInEuro = Number(rezervasyon.price) / Number(settings?.euro_rate || 32.50);
                  return (
                    <tr 
                      key={rezervasyon.id}
                      onClick={() => handleRowClick(rezervasyon.id)}
                      className={`${currentUser?.isAdmin ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
                    >
                      <td className="py-1 px-1 sm:py-2 sm:px-2 border">{rezervasyon.name}</td>
                      <td className="py-1 px-1 sm:py-2 sm:px-2 border">{rezervasyon.house.name}</td>
                      <td className="py-1 px-1 sm:py-2 sm:px-2 border">{new Date(rezervasyon.start).toLocaleDateString('tr-TR')}</td>
                      <td className="py-1 px-1 sm:py-2 sm:px-2 border">{new Date(rezervasyon.finish).toLocaleDateString('tr-TR')}</td>
                      <td className="py-1 px-1 sm:py-2 sm:px-2 border">
                        <div className="flex flex-col">
                          <span>{Number(rezervasyon.price).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                          <span className="text-gray-600 text-xs">{priceInEuro.toLocaleString('tr-TR', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                      </td>
                      <td className="py-1 px-1 sm:py-2 sm:px-2 border">{rezervasyon.worker.name}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-2 px-2 sm:py-4 sm:px-4 text-center border">
                    Bu ay için kayıtlı rezervasyon bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
} 