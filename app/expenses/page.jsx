"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useExpenses } from "../hooks/useExpenses";
import { useCategories } from "../hooks/useCategories";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";

export default function ExpensesPage() {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { data: expenses, isLoading: expensesLoading, error: expensesError } = useExpenses();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [filteredByMonthExpenses, setFilteredByMonthExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  
  useEffect(() => {
    if (expenses) {
      const filtered = expenses.filter((gider) => {
        if (!gider.created_at) return false;
        const date = new Date(gider.created_at);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });
      setFilteredByMonthExpenses(filtered);
      
      // Toplam tutarı hesapla
      const total = filtered.reduce((sum, gider) => sum + Number(gider.price || 0), 0);
      setTotalAmount(total);
    }
  }, [expenses, currentMonth, currentYear]);

  const filteredExpenses = filteredByMonthExpenses?.filter(
    (gider) => {
      // Arama terimine göre filtreleme
      const matchesSearch = gider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gider.house.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gider.category.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Kategoriye göre filtreleme
      const matchesCategory = selectedCategory === "" || 
        (gider.category && gider.category.id === parseInt(selectedCategory));
      
      return matchesSearch && matchesCategory;
    }
  ) || [];

  if (expensesLoading || categoriesLoading) {
    return <div className="container mx-auto p-4">Yükleniyor...</div>;
  }

  if (expensesError) {
    return <div className="container mx-auto p-4">Hata: {expensesError.message}</div>;
  }

  // Tarih formatını düzenleme fonksiyonu
  const formatDate = (dateString) => {
    if (!dateString) return "Belirtilmemiş";
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Giderler</h1>
        
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start md:items-center gap-2 sm:gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Ara..."
                className="border rounded py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none border rounded py-2 pl-3 pr-10 w-full sm:min-w-[150px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm"
              >
                <option value="">Tüm Kategoriler</option>
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
          </div>
          
          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
            <div className="flex items-center space-x-2">
              <button 
                onClick={goToPreviousMonth}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              >
                &lt;
              </button>
              <span className="font-semibold whitespace-nowrap">
                {getMonthName(currentMonth)} {currentYear}
              </span>
              <button 
                onClick={goToNextMonth}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              >
                &gt;
              </button>
            </div>
            
            {currentUser?.isAdmin && (
              <Link href="/expenses/new" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded whitespace-nowrap">
                Yeni Gider
              </Link>
            )}
          </div>
        </div>
        
        <div className="mb-4 bg-blue-50 p-3 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span className="font-semibold text-blue-700">
              {getMonthName(currentMonth)} {currentYear} Ayı Toplam Gider:
            </span>
            <span className="text-lg font-bold text-blue-800">
              ₺{totalAmount.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-1 px-2 border">Adı</th>
                <th className="py-1 px-2 border">Ev</th>
                <th className="py-1 px-2 border">Fiyat</th>
                <th className="py-1 px-2 border">Çalışan</th>
                <th className="py-1 px-2 border">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((gider) => (
                  <tr 
                    key={gider.id} 
                    className={`${currentUser?.isAdmin ? 'hover:bg-gray-100 cursor-pointer' : ''} transition-colors`}
                    onClick={() => currentUser?.isAdmin && (window.location.href = `/expenses/${gider.id}/edit`)}
                  >
                    <td className="py-1 px-2 border">{gider.name}</td>
                    <td className="py-1 px-2 border">{gider.house.name}</td>
                    <td className="py-1 px-2 border">₺{Number(gider.price).toLocaleString('tr-TR')}</td>
                    <td className="py-1 px-2 border">{gider.worker.name}</td>
                    <td className="py-1 px-2 border">{formatDate(gider.created_at)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    Gider bulunamadı
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