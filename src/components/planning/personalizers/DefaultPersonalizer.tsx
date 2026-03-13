'use client';

import { useState } from 'react';

export function DefaultPersonalizer() {
  const [budget, setBudget] = useState(50);
  const [priority, setPriority] = useState<'Savings' | 'Performance'>('Savings');
  const [financing, setFinancing] = useState<'Cash' | 'Loan'>('Cash');

  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Budget range</label>
        <input
          type="range"
          min={0} max={100} step={1}
          value={budget}
          onChange={(e) => setBudget(+e.target.value)}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#4F8F73]"
          style={{ background: `linear-gradient(to right, #4F8F73 ${budget}%, #e5e7eb ${budget}%)` }}
        />
        <p className="text-xs text-gray-500 mt-1 text-center">
          {budget < 30 ? 'Budget-friendly' : budget < 70 ? 'Moderate' : 'Premium'}
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Priority</label>
        <div className="flex gap-2">
          {(['Savings', 'Performance'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setPriority(opt)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                priority === opt
                  ? 'bg-[#4F8F73] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Financing</label>
        <div className="flex gap-2">
          {(['Cash', 'Loan'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFinancing(opt)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                financing === opt
                  ? 'bg-[#4F8F73] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <button className="text-sm text-[#4F8F73] font-medium hover:underline flex items-center gap-1">
        Advanced Personalization <span className="text-xs">▾</span>
      </button>
    </div>
  );
}
