"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import LoginForm from "./components/LoginForm";
import { useExpenses } from "./hooks/useExpenses";
import { useReservations } from "./hooks/useReservations";
import { useHouses } from "./hooks/useHouses";
import { useSettings } from "./hooks/useSettings";
import { useWorkers } from "./hooks/useWorkers";
import { useAuth } from "./hooks/useAuth";

export default function Home() {
  // Auth hooks
  const { isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser, isLoading } = useAuth();

  // State hooks
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState({
    profit: 0,
    reservationCount: 0,
    totalExpense: 0,
    totalRevenue: 0,
    totalRevenueInEuro: 0
  });
  const [workersSettlement, setWorkersSettlement] = useState([]);
  const [workerExpenses, setWorkerExpenses] = useState([]);
  
  // Query hooks
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const { data: reservations, isLoading: reservationsLoading } = useReservations();
  const { data: houses, isLoading: housesLoading } = useHouses();
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const { data: workers, isLoading: workersLoading } = useWorkers();

  // Helper functions
  const getMonthName = (month) => {
    const months = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];
    return months[month];
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Data processing effect
  useEffect(() => {
    if (!expensesLoading && !reservationsLoading && !housesLoading && !settingsLoading && !workersLoading && 
        expenses && reservations && houses && settings && workers) {
      // Seçilen ay için giderleri filtrele
      const filteredExpenses = expenses.filter((expense) => {
        if (!expense.created_at) return false;
        const date = new Date(expense.created_at);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });
      
      // Seçilen ay için rezervasyonları filtrele
      const filteredReservations = reservations.filter((reservation) => {
        if (!reservation.start) return false;
        const date = new Date(reservation.start);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });
      
      // Toplam gideri hesapla
      const totalExpense = filteredExpenses.reduce(
        (sum, expense) => sum + Number(expense.price || 0), 
        0
      );
      
      // Toplam geliri hesapla
      const totalRevenue = filteredReservations.reduce(
        (sum, reservation) => sum + Number(reservation.price || 0), 
        0
      );
      
      // Euro cinsinden toplam geliri hesapla
      const euroRate = Number(settings?.euro_rate || 32.50);
      const totalRevenueInEuro = totalRevenue / euroRate;

      // Kar hesapla
      const profit = totalRevenue - totalExpense;
      
      // İstatistikleri güncelle
      setStats({
        profit,
        reservationCount: filteredReservations.length,
        totalExpense,
        totalRevenue,
        totalRevenueInEuro
      });

      // Çalışanların giderlerini hesapla
      const workerExpenseMap = {};
      filteredExpenses.forEach((expense) => {
        const workerId = expense.worker_id;
        if (!workerExpenseMap[workerId]) {
          workerExpenseMap[workerId] = 0;
        }
        workerExpenseMap[workerId] += Number(expense.price || 0);
      });

      // Çalışanların rezervasyon kazançlarını hesapla
      const workerReservationCounts = {};
      const workerEarnings = {};
      const workerPayAmount = Number(settings?.worker_pay_amount || 0);

      filteredReservations.forEach((reservation) => {
        const workerId = reservation.worker_id;
        if (!workerReservationCounts[workerId]) {
          workerReservationCounts[workerId] = 0;
          workerEarnings[workerId] = 0;
        }
        workerReservationCounts[workerId]++;
        workerEarnings[workerId] += workerPayAmount;
      });

      // AŞAMA 1: Sadece harcamalara göre eşitleme
      const workerExpenseBalances = workers.map(worker => {
        const expenses = workerExpenseMap[worker.id] || 0;
        return {
          workerId: worker.id,
          workerName: worker.name,
          expenses
        };
      });
      
      // Harcamaların ortalamasını hesapla
      const totalWorkerExpenses = workerExpenseBalances.reduce((sum, w) => sum + w.expenses, 0);
      const averageExpense = totalWorkerExpenses / workers.length;

      // Harcama sapmalarını hesapla
      const expenseDeviations = workerExpenseBalances.map(worker => ({
        ...worker,
        deviation: worker.expenses - averageExpense
      }));

      // Harcama borç/alacak ilişkilerini hesapla
      const expenseSettlements = [];
      const expenseDebtors = expenseDeviations.filter(w => w.deviation > 0)
        .sort((a, b) => b.deviation - a.deviation);
      const expenseCreditors = expenseDeviations.filter(w => w.deviation < 0)
        .sort((a, b) => a.deviation - b.deviation);

      // Her fazla harcayan için az harcayanlardan borç kapatma
      expenseDebtors.forEach(debtor => {
        let remainingDebt = debtor.deviation;
        expenseCreditors.forEach(creditor => {
          if (remainingDebt > 0 && Math.abs(creditor.deviation) > 0) {
            const transferAmount = Math.min(remainingDebt, Math.abs(creditor.deviation));
            if (transferAmount > 0) {
              expenseSettlements.push({
                from: debtor.workerName,
                to: creditor.workerName,
                amount: Math.round(transferAmount * 100) / 100,
                type: 'expense'
              });
              remainingDebt -= transferAmount;
              creditor.deviation += transferAmount;
            }
          }
        });
      });

      // AŞAMA 2: Rezervasyon kazançları farkı ve harcama hesaplaşması sonrası final durum
      const finalBalances = workers.map(worker => {
        const expenses = workerExpenseMap[worker.id] || 0;
        const earnings = workerEarnings[worker.id] || 0;
        const reservationCount = workerReservationCounts[worker.id] || 0;
        
        return {
          workerId: worker.id,
          workerName: worker.name,
          reservationCount,
          expenses,
          earnings
        };
      });

      // İki çalışanın rezervasyon kazançları arasındaki farkı hesapla
      const worker1 = finalBalances[0];
      const worker2 = finalBalances[1];
      const reservationEarningsDiff = worker1.earnings - worker2.earnings;

      // Harcama hesaplaşmasındaki transfer tutarını bul
      const expenseTransferAmount = expenseSettlements.reduce((total, settlement) => {
        if (settlement.from === worker1.workerName) return total + settlement.amount;
        if (settlement.from === worker2.workerName) return total - settlement.amount;
        return total;
      }, 0);

      // Final hesaplaşma - Tek bir transfer olacak
      const finalSettlements = [];
      
      // Rezervasyon kazanç farkından harcama transferini çıkar
      const finalTransferAmount = reservationEarningsDiff + expenseTransferAmount;

      if (Math.abs(finalTransferAmount) > 0) {
        if (finalTransferAmount > 0) {
          // Worker1 Worker2'ye ödeme yapacak
          finalSettlements.push({
            from: worker1.workerName,
            to: worker2.workerName,
            amount: Math.round(Math.abs(finalTransferAmount) * 100) / 100,
            type: 'final'
          });
        } else {
          // Worker2 Worker1'e ödeme yapacak
          finalSettlements.push({
            from: worker2.workerName,
            to: worker1.workerName,
            amount: Math.round(Math.abs(finalTransferAmount) * 100) / 100,
            type: 'final'
          });
        }
      }

      // Çalışan durumlarını güncelle
      const settlementList = finalBalances.map(worker => ({
        workerId: worker.workerId,
        workerName: worker.workerName,
        reservationCount: worker.reservationCount,
        expenses: worker.expenses,
        earnings: worker.earnings,
        expenseSettlements: expenseSettlements.filter(s => s.from === worker.workerName || s.to === worker.workerName),
        finalSettlements: finalSettlements.filter(s => s.from === worker.workerName || s.to === worker.workerName)
      }));

      setWorkersSettlement(settlementList);
    }
  }, [currentMonth, currentYear, expenses, reservations, houses, settings, workers,
    expensesLoading, reservationsLoading, housesLoading, settingsLoading, workersLoading]);

  // Günlük ev durumlarını hesapla
  const calculateHouseStatuses = () => {
    if (!reservations || !houses) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentlyOccupied = [];
    const checkingIn = [];
    const checkingOut = [];

    reservations.forEach(reservation => {
      const startDate = new Date(reservation.start);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(reservation.finish);
      endDate.setHours(0, 0, 0, 0);

      const house = houses.find(h => h.id === reservation.house_id);
      if (!house) return;

      // Bugün dolu mu?
      if (today >= startDate && today <= endDate) {
        currentlyOccupied.push(house);
      }

      // Bugün check-in var mı?
      if (startDate.getTime() === today.getTime()) {
        checkingIn.push(house);
      }

      // Bugün check-out var mı?
      if (endDate.getTime() === today.getTime()) {
        checkingOut.push(house);
      }
    });

    return {
      currentlyOccupied: [...new Set(currentlyOccupied)],
      checkingIn: [...new Set(checkingIn)],
      checkingOut: [...new Set(checkingOut)]
    };
  };

  const houseStatuses = calculateHouseStatuses();

  // Aylık doluluk oranlarını hesapla
  const calculateMonthlyOccupancyRates = () => {
    if (!reservations || !houses) return null;

    // Seçili ayın ilk ve son günlerini bul
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    lastDayOfMonth.setHours(23, 59, 59, 999);
    const daysInMonth = lastDayOfMonth.getDate();

    console.log('Seçili ay:', currentMonth + 1, currentYear);
    console.log('Ay başlangıcı:', firstDayOfMonth.toISOString());
    console.log('Ay sonu:', lastDayOfMonth.toISOString());
    console.log('Toplam rezervasyon sayısı:', reservations.length);

    // Her ev için doluluk bilgilerini hesapla
    const occupancyRates = houses.map(house => {
      // Bu eve ait seçili aydaki rezervasyonları filtrele
      const houseReservations = reservations.filter(reservation => {
        if (!reservation.start || !reservation.finish || reservation.house_id !== house.id) {
          return false;
        }
        
        const startDate = new Date(reservation.start);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(reservation.finish);
        endDate.setHours(23, 59, 59, 999);

        // Rezervasyon bu ayla kesişiyor mu?
        return (startDate <= lastDayOfMonth && endDate >= firstDayOfMonth);
      });

      console.log(`${house.name} için bulunan rezervasyon sayısı:`, houseReservations.length);

      // Her rezervasyon için dolu günleri hesapla
      const occupiedDays = new Set();
      
      // Ayın her günü için kontrol et
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(currentYear, currentMonth, day);
        currentDate.setHours(12, 0, 0, 0); // Günün ortasını kullan

        // Bu günde herhangi bir rezervasyon var mı?
        const isOccupied = houseReservations.some(reservation => {
          const startDate = new Date(reservation.start);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(reservation.finish);
          endDate.setHours(23, 59, 59, 999);
          
          const isDayOccupied = currentDate >= startDate && currentDate <= endDate;
          return isDayOccupied;
        });

        if (isOccupied) {
          occupiedDays.add(day);
        }
      }

      console.log(`${house.name} için dolu günler:`, Array.from(occupiedDays));

      // Doluluk oranını hesapla
      const occupancyRate = (occupiedDays.size / daysInMonth) * 100;

      return {
        houseName: house.name,
        occupancyRate: Math.round(occupancyRate),
        occupiedDays: occupiedDays.size,
        totalDays: daysInMonth
      };
    });

    // Ortalama doluluk oranını hesapla
    const averageOccupancy = Math.round(
      occupancyRates.reduce((sum, house) => sum + house.occupancyRate, 0) / houses.length
    );

    return {
      houses: occupancyRates,
      average: averageOccupancy
    };
  };

  const occupancyRates = calculateMonthlyOccupancyRates();

  // Render loading state
  if (isLoading || expensesLoading || reservationsLoading || housesLoading || settingsLoading || workersLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Render login form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <LoginForm setLoggedIn={setIsLoggedIn} setCurrentUser={setCurrentUser} />
      </div>
    );
  }

  // Main render
  return (
    <>
      <Navbar />
      <div className="flex-1 bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <div className="flex items-center space-x-2">
          <button 
            onClick={goToPreviousMonth}
                className="px-3 py-2 bg-white rounded-lg shadow hover:bg-gray-50"
          >
                ←
          </button>
              <span className="text-lg font-medium text-gray-700">
            {getMonthName(currentMonth)} {currentYear}
          </span>
          <button 
            onClick={goToNextMonth}
                className="px-3 py-2 bg-white rounded-lg shadow hover:bg-gray-50"
          >
                →
          </button>
            </div>
          </div>

          {/* Aylık Doluluk Oranları */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Aylık Doluluk Oranları
                {occupancyRates && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    (Ortalama: %{occupancyRates.average})
                  </span>
                )}
              </h3>
              {occupancyRates?.houses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {occupancyRates.houses.map((house, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700">{house.houseName}</span>
                        <span className={`text-sm font-semibold ${
                          house.occupancyRate >= 75 ? 'text-green-600' :
                          house.occupancyRate >= 50 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          %{house.occupancyRate}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            house.occupancyRate >= 75 ? 'bg-green-600' :
                            house.occupancyRate >= 50 ? 'bg-yellow-500' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${house.occupancyRate}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {house.occupiedDays} / {house.totalDays} gün dolu
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Bu ay için doluluk verisi bulunamadı</p>
              )}
            </div>
          </div>

          {/* Günlük Ev Durumları */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Dolu Evler */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Şu An Dolu Evler
                {houseStatuses?.currentlyOccupied.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({houseStatuses.currentlyOccupied.length} ev)
                  </span>
                )}
              </h3>
              {houseStatuses?.currentlyOccupied.length > 0 ? (
                <div className="space-y-2">
                  {houseStatuses.currentlyOccupied.map(house => (
                    <div key={house.id} className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-gray-700">{house.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Şu an dolu ev yok</p>
              )}
            </div>

            {/* Check-in Yapılacak Evler */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Bugün Check-in
                {houseStatuses?.checkingIn.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({houseStatuses.checkingIn.length} ev)
                  </span>
                )}
              </h3>
              {houseStatuses?.checkingIn.length > 0 ? (
                <div className="space-y-2">
                  {houseStatuses.checkingIn.map(house => (
                    <div key={house.id} className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-gray-700">{house.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Bugün check-in yok</p>
              )}
            </div>

            {/* Check-out Yapılacak Evler */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Bugün Check-out
                {houseStatuses?.checkingOut.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({houseStatuses.checkingOut.length} ev)
                  </span>
                )}
              </h3>
              {houseStatuses?.checkingOut.length > 0 ? (
                <div className="space-y-2">
                  {houseStatuses.checkingOut.map(house => (
                    <div key={house.id} className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-gray-700">{house.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Bugün check-out yok</p>
              )}
            </div>
        </div>
        
        <Dashboard stats={stats} />
        
          {/* Çalışan İstatistikleri */}
        <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Çalışan Hesaplaşması</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Çalışan
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rezervasyon Sayısı
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Harcamalar
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Harcama Hesaplaşması
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rezervasyon Kazancı
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Final Hesaplaşma
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {workersSettlement.map((worker) => (
                      <tr key={worker.workerId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {worker.workerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {worker.reservationCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                          ₺{worker.expenses.toLocaleString('tr-TR', {minimumFractionDigits: 2})}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {worker.expenseSettlements.map((settlement, index) => (
                            <div key={index} className="mb-1">
                              {settlement.from === worker.workerName ? (
                                <span className="text-green-600">
                                  {settlement.to}'dan ₺{settlement.amount.toLocaleString('tr-TR', {minimumFractionDigits: 2})} alınacak
                                </span>
                              ) : (
                                <span className="text-red-600">
                                  {settlement.from}'a ₺{settlement.amount.toLocaleString('tr-TR', {minimumFractionDigits: 2})} ödenecek
                                </span>
                              )}
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          ₺{worker.earnings.toLocaleString('tr-TR', {minimumFractionDigits: 2})}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {worker.finalSettlements.map((settlement, index) => (
                            <div key={index} className="mb-1">
                              {settlement.from === worker.workerName ? (
                                <span className="text-green-600">
                                  {settlement.to}'dan ₺{settlement.amount.toLocaleString('tr-TR', {minimumFractionDigits: 2})} alınacak
                                </span>
                              ) : (
                                <span className="text-red-600">
                                  {settlement.from}'a ₺{settlement.amount.toLocaleString('tr-TR', {minimumFractionDigits: 2})} ödenecek
                                </span>
                              )}
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 