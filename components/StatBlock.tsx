
import React from 'react';
import { DeepwokenStats } from '../types';

interface StatBlockProps {
  stats: DeepwokenStats;
  label?: string;
  variant?: 'pre' | 'post';
}

const StatBlock: React.FC<StatBlockProps> = ({ stats, label, variant = 'pre' }) => {
  const statEntries = [
    { label: 'STR', value: stats.strength, color: 'bg-red-900/20', border: 'border-red-500/30', text: 'text-red-400' },
    { label: 'FOR', value: stats.fortitude, color: 'bg-orange-900/20', border: 'border-orange-500/30', text: 'text-orange-400' },
    { label: 'AGI', value: stats.agility, color: 'bg-emerald-900/20', border: 'border-emerald-500/30', text: 'text-emerald-400' },
    { label: 'INT', value: stats.intelligence, color: 'bg-blue-900/20', border: 'border-blue-500/30', text: 'text-blue-400' },
    { label: 'WIL', value: stats.willpower, color: 'bg-purple-900/20', border: 'border-purple-500/30', text: 'text-purple-400' },
    { label: 'CHA', value: stats.charisma, color: 'bg-pink-900/20', border: 'border-pink-500/30', text: 'text-pink-400' },
  ];

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <h5 className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 ${variant === 'pre' ? 'text-blue-400' : 'text-emerald-400'}`}>
          {label}
        </h5>
      )}
      <div className="grid grid-cols-3 gap-2">
        {statEntries.map((stat) => (
          <div 
            key={stat.label} 
            className={`${stat.color} ${stat.border} border px-2 py-1.5 rounded flex flex-col items-center justify-center transition-all`}
          >
            <span className="text-[9px] uppercase font-bold opacity-60 leading-none mb-1">{stat.label}</span>
            <span className={`text-sm font-cinzel font-bold ${stat.text}`}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatBlock;
