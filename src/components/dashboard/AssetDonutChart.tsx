import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useStore } from '../../store/useStore';

export default function AssetDonutChart() {
  const { assets } = useStore();
  
  // Aggregate assets by type
  const typeMap = assets.reduce((acc, a) => {
    let type = a.type || 'Other';
    if (type === 'Wallet') type = 'Crypto';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const typeColors: Record<string, string> = {
    Crypto: '#F59E0B',
    Retirement: '#10B981',
    NFT: '#EC4899',
    Document: '#4F5CFF',
    Account: '#6366F1',
    Other: '#6B7280'
  };

  const data = Object.entries(typeMap).map(([name, value]) => ({
    name,
    value,
    color: typeColors[name] || '#6B7280'
  }));

  const isEmpty = data.length === 0;

  return (
    <div className="h-64 w-full relative">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <PieChart>
          {!isEmpty && (
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
               outerRadius={80}
               paddingAngle={5}
               dataKey="value"
               stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          )}
          {!isEmpty && (
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--color-text-primary)' }}
              itemStyle={{ color: 'var(--color-text-primary)' }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
      
      {isEmpty && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-40 h-40 opacity-5" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray="10 10"/>
            </svg>
         </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <span className="block text-2xl font-bold text-primary">{assets.length}</span>
          <span className="text-xs text-muted">Total Assets</span>
        </div>
      </div>
    </div>
  );
}
