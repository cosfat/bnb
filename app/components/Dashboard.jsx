export default function Dashboard({ stats }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Genel Bakış</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Aylık Kar/Zarar" 
          value={stats.profit.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          icon="💹" 
          color={stats.profit >= 0 ? "bg-emerald-50" : "bg-rose-50"} 
          textColor={stats.profit >= 0 ? "text-emerald-600" : "text-rose-600"} 
        />
        <StatCard 
          title="Rezervasyonlar" 
          value={stats.reservationCount} 
          icon="📅" 
          color="bg-green-50" 
          textColor="text-green-600" 
        />
        <StatCard 
          title="Giderler" 
          value={stats.totalExpense.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          icon="💰" 
          color="bg-red-50" 
          textColor="text-red-600" 
        />
        <StatCard 
          title="Gelirler" 
          value={stats.totalRevenue.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          subValue={stats.totalRevenueInEuro.toLocaleString('tr-TR', { style: 'currency', currency: 'EUR' })}
          icon="💸" 
          color="bg-purple-50" 
          textColor="text-purple-600" 
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, subValue, icon, color, textColor }) {
  return (
    <div className={`${color} rounded-lg p-4 flex items-center`}>
      <div className={`${textColor} text-3xl mr-4`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className={`${textColor} text-xl font-bold`}>{value}</p>
        {subValue && (
          <p className={`${textColor} text-sm mt-1`}>{subValue}</p>
        )}
      </div>
    </div>
  );
} 