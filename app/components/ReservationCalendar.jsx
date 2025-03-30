import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function ReservationCalendar({ reservations, houses, currentMonth, currentYear, goToPreviousMonth, goToNextMonth }) {
  const [calendarValue, setCalendarValue] = useState(new Date(currentYear, currentMonth, 1));
  const [reservationsByDate, setReservationsByDate] = useState({});
  const [hoveredDate, setHoveredDate] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const [isBrowser, setIsBrowser] = useState(false);

  // İstemci tarafında olduğumuzu kontrol et
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Pencere boyutlarını izle
  useEffect(() => {
    if (!isBrowser) return;
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    // İlk boyutu ayarla
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isBrowser]);

  // Ay değiştiğinde takvim değerini güncelle
  useEffect(() => {
    setCalendarValue(new Date(currentYear, currentMonth, 1));
  }, [currentMonth, currentYear]);

  // Rezervasyonları tarihe göre grupla
  useEffect(() => {
    if (!reservations || !houses || !Array.isArray(reservations) || !Array.isArray(houses)) return;

    const reservationMap = {};
    
    reservations.forEach(reservation => {
      if (!reservation?.start || !reservation?.finish) return;
      
      try {
        // Tarih aralığındaki her gün için rezervasyon bilgisini ekle
        const startDate = new Date(reservation.start);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(reservation.finish);
        endDate.setHours(0, 0, 0, 0);

        const house = houses.find(h => h?.id === reservation?.house_id);
        if (!house) return;

        // Tarih formatları ekleniyor
        const formattedStartDate = startDate.toLocaleDateString('tr-TR');
        const formattedEndDate = endDate.toLocaleDateString('tr-TR');

        // Başlangıç tarihi ile bitiş tarihi arasındaki her gün için
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const dateStr = currentDate.toISOString().split('T')[0];
          
          if (!reservationMap[dateStr]) {
            reservationMap[dateStr] = [];
          }
          
          reservationMap[dateStr].push({
            ...reservation,
            houseName: house.name || "İsimsiz",
            formattedStartDate,
            formattedEndDate
          });
          
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } catch (error) {
        console.error("Rezervasyon işleme hatası:", error, reservation);
      }
    });
    
    setReservationsByDate(reservationMap);
  }, [reservations, houses]);

  // Tarih renklendirme ve içerik fonksiyonu
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    try {
      const dateStr = date.toISOString().split('T')[0];
      const dateReservations = reservationsByDate[dateStr] || [];
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const compareDate = new Date(date);
      compareDate.setHours(0, 0, 0, 0);
      const isToday = today.getTime() === compareDate.getTime();
      
      if (dateReservations.length === 0 && !isToday) return null;
      
      return (
        <div className="relative w-full h-full">
          {isToday && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center pointer-events-none">
              <div className="w-7 h-7 rounded-full border-2 border-blue-500" />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center">
            {dateReservations.map((res, index) => (
              <div 
                key={`${res.id || index}-${index}`} 
                className="w-2 h-2 mx-0.5 mb-0.5 rounded-full" 
                style={{ 
                  backgroundColor: getReservationColor(res.id || 0) 
                }}
              />
            ))}
          </div>
        </div>
      );
    } catch (error) {
      console.error("Tarih içeriği oluşturma hatası:", error, date);
      return null;
    }
  };

  // Her rezervasyon için belirli bir renk döndür
  const getReservationColor = (reservationId) => {
    try {
      const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33A8', 
        '#33FFF5', '#FFD133', '#8C33FF', '#FF8C33', '#33FFBD'
      ];
      
      // Rezervasyon ID'sine göre belirli bir renk seç
      const id = Number(reservationId) || 0;
      return colors[id % colors.length];
    } catch (error) {
      console.error("Renk hesaplama hatası:", error);
      return '#cccccc'; // Hata durumunda gri renk
    }
  };

  // Tooltip işlemleri
  const handleDateMouseOver = (event, date) => {
    if (!date) return;
    
    try {
      const dateStr = date.toISOString().split('T')[0];
      const dateReservations = reservationsByDate[dateStr] || [];
      
      if (dateReservations.length > 0) {
        // Tarayıcı penceresinin sınırları içinde konumlandır
        const rect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
        
        // Göreli pozisyonu hesapla
        const x = event?.clientX || rect.left || 0;
        const y = event?.clientY || rect.top || 0;
        
        setHoveredDate(dateStr);
        setTooltipPosition({ x, y });
      } else {
        setHoveredDate(null);
      }
    } catch (error) {
      console.error("Fare olayı hatası:", error);
      setHoveredDate(null);
    }
  };

  // Fare çekildiğinde tooltip'i kapat
  const handleMouseLeave = () => {
    setHoveredDate(null);
  };

  // Aktif ay gösterimine geç
  const handleActiveStartDateChange = ({ activeStartDate }) => {
    if (!activeStartDate) return;
    
    try {
      // react-calendar'ın aktif ay değiştiğinde ana sayfa state'ini güncelle
      const newMonth = activeStartDate.getMonth();
      const newYear = activeStartDate.getFullYear();
      
      if (newMonth !== currentMonth || newYear !== currentYear) {
        if (newMonth < currentMonth || (newMonth === 11 && currentMonth === 0 && newYear < currentYear)) {
          goToPreviousMonth();
        } else if (newMonth > currentMonth || (newMonth === 0 && currentMonth === 11 && newYear > currentYear)) {
          goToNextMonth();
        }
      }
    } catch (error) {
      console.error("Ay değişimi hatası:", error);
    }
  };

  if (!isBrowser) {
    return <div className="p-4 text-center">Takvim yükleniyor...</div>;
  }

  return (
    <div className="reservation-calendar-container" ref={containerRef}>
      <div className="bg-white rounded-lg shadow p-4 calendar-wrapper">
        <Calendar
          onChange={setCalendarValue}
          value={calendarValue}
          onActiveStartDateChange={handleActiveStartDateChange}
          tileContent={tileContent}
          tileClassName={({ date }) => {
            if (!date) return '';
            
            try {
              const dateStr = date.toISOString().split('T')[0];
              
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const compareDate = new Date(date);
              compareDate.setHours(0, 0, 0, 0);
              const isToday = today.getTime() === compareDate.getTime();
              
              const hasReservation = reservationsByDate[dateStr]?.length > 0;
              
              return [
                hasReservation ? 'has-reservation' : null,
                isToday ? 'today-highlight' : null
              ].filter(Boolean).join(' ');
            } catch (error) {
              console.error("Sınıf adı hatası:", error);
              return '';
            }
          }}
          onClickDay={(value) => {
            if (!value) return;
            
            try {
              const dateStr = value.toISOString().split('T')[0];
              if (reservationsByDate[dateStr]?.length > 0) {
                handleDateMouseOver({ clientX: 0, clientY: 0 }, value);
              } else {
                setHoveredDate(null);
              }
            } catch (error) {
              console.error("Gün tıklama hatası:", error);
            }
          }}
          formatDay={(locale, date) => {
            if (!date) return '';
            
            try {
              const dateStr = date.toISOString().split('T')[0];
              
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const compareDate = new Date(date);
              compareDate.setHours(0, 0, 0, 0);
              const isToday = today.getTime() === compareDate.getTime();
              
              const hasReservation = reservationsByDate[dateStr]?.length > 0;
              
              return (
                <div 
                  onMouseOver={(e) => handleDateMouseOver(e, date)}
                  onMouseLeave={handleMouseLeave}
                  className={`w-full h-full flex justify-center items-center ${hasReservation ? 'cursor-pointer' : ''}`}
                >
                  {isToday ? (
                    <div className="flex items-center justify-center today-circle">
                      {date.getDate()}
                    </div>
                  ) : (
                    date.getDate()
                  )}
                </div>
              );
            } catch (error) {
              console.error("Gün formatlama hatası:", error);
              return date.getDate();
            }
          }}
        />
        
        {isBrowser && hoveredDate && (
          <div 
            className="reservation-tooltip bg-white shadow-lg rounded-md p-3 fixed z-50"
            style={{ 
              left: `${Math.min(tooltipPosition.x + 10, (windowSize.width || 0) - 320)}px`, 
              top: `${Math.min(tooltipPosition.y + 10, (windowSize.height || 0) - 200)}px`,
              maxWidth: '300px',
              maxHeight: '300px',
              overflowY: 'auto'
            }}
          >
            <button 
              onClick={() => setHoveredDate(null)}
              className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h4 className="font-semibold text-gray-800 mb-2">{new Date(hoveredDate).toLocaleDateString('tr-TR')}</h4>
            <ul className="space-y-1">
              {(reservationsByDate[hoveredDate] || []).map((res, index) => (
                <li key={`tooltip-${res.id || index}-${index}`} className="flex items-start">
                  <div 
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0 mt-1" 
                    style={{ backgroundColor: getReservationColor(res.id || 0) }}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{res.name || "İsimsiz"}</span>
                    <div className="flex flex-wrap items-center text-xs text-gray-600">
                      <span>{res.houseName || "Bilinmiyor"}</span>
                      <span className="mx-1">•</span>
                      <span className="font-medium text-green-600">₺{Number(res.price || 0).toLocaleString('tr-TR', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      <span>{res.formattedStartDate || "-"}</span>
                      <span className="mx-1">→</span>
                      <span>{res.formattedEndDate || "-"}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <style jsx>{`
        .reservation-calendar-container {
          margin-bottom: 2rem;
        }
        
        :global(.react-calendar) {
          width: 100%;
          border: none;
          font-family: inherit;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }
        
        :global(.react-calendar__tile) {
          position: relative;
          height: 65px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          padding-top: 8px;
          border-radius: 0.25rem;
          transition: background-color 0.2s;
        }
        
        :global(.react-calendar__tile:hover) {
          background-color: #f0f0f0;
        }
        
        :global(.react-calendar__tile--now) {
          background: rgba(24, 144, 255, 0.15);
        }
        
        :global(.today-highlight) {
          border: 2px solid #1890ff !important;
          box-shadow: 0 0 8px rgba(24, 144, 255, 0.5);
          z-index: 1;
        }
        
        :global(.today-circle) {
          width: 28px;
          height: 28px;
          background-color: #1890ff;
          color: white;
          border-radius: 50%;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        :global(.react-calendar__tile--active) {
          background: #e6f7ff;
          color: black;
        }
        
        :global(.react-calendar__tile--active:enabled:hover,
                .react-calendar__tile--active:enabled:focus) {
          background: #d6f0ff;
        }
        
        :global(.has-reservation) {
          font-weight: bold;
          color: #1890ff;
          background-color: rgba(24, 144, 255, 0.1);
        }
        
        :global(.has-reservation:hover) {
          background-color: rgba(24, 144, 255, 0.2);
        }
        
        :global(.react-calendar__navigation) {
          margin-bottom: 10px;
          height: 44px;
          display: flex;
        }
        
        :global(.react-calendar__navigation button) {
          min-width: 36px;
          background: none;
          border-radius: 0.25rem;
          transition: background-color 0.2s;
        }
        
        :global(.react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus) {
          background-color: #f8f8fa;
        }
        
        :global(.react-calendar__month-view__weekdays) {
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.8em;
          margin-bottom: 0.5rem;
        }
        
        :global(.react-calendar__month-view__weekdays__weekday) {
          padding: 0.5rem;
        }
        
        :global(.react-calendar__month-view__days__day--weekend) {
          color: #d10000;
        }
        
        :global(.react-calendar__month-view__days__day--neighboringMonth) {
          color: #969696;
        }
        
        @media (max-width: 640px) {
          :global(.react-calendar__tile) {
            height: 50px;
            padding-top: 4px;
          }
          
          :global(.react-calendar__navigation) {
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
} 