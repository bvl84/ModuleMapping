'use client';

import { useState } from 'react';

export function HvacPersonalizer() {
  const [hasDuctwork, setHasDuctwork] = useState(false);
  const [systemAge, setSystemAge] = useState(20);
  const [heatingFuel, setHeatingFuel] = useState<'Natural Gas' | 'Fuel Oil' | 'Propane' | 'Electric'>('Natural Gas');
  const [financing, setFinancing] = useState<'Cash' | 'Loan'>('Cash');

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Do you have existing ductwork?</label>
          <button className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-xs text-gray-400 hover:text-gray-600">
            i
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setHasDuctwork(true)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              hasDuctwork
                ? 'bg-[#4F8F73] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => setHasDuctwork(false)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              !hasDuctwork
                ? 'bg-[#4F8F73] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            No
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Age of current system</label>
        <input
          type="range"
          min={0} max={40} step={1}
          value={systemAge}
          onChange={(e) => setSystemAge(+e.target.value)}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#4F8F73]"
          style={{ background: `linear-gradient(to right, #4F8F73 ${(systemAge / 40) * 100}%, #e5e7eb ${(systemAge / 40) * 100}%)` }}
        />
        <p className="text-xs text-gray-500 mt-1 text-center">{systemAge} yrs</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Current heating fuel</label>
          <button className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-xs text-gray-400 hover:text-gray-600">
            i
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(['Natural Gas', 'Fuel Oil', 'Propane', 'Electric'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setHeatingFuel(opt)}
              className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                heatingFuel === opt
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
