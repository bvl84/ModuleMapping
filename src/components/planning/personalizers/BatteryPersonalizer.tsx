'use client';

import { useState } from 'react';

export function BatteryPersonalizer() {
  const [backupHours, setBackupHours] = useState(12);
  const [primaryUse, setPrimaryUse] = useState<'Backup power' | 'Solar + Storage'>('Backup power');
  const [financing, setFinancing] = useState<'Cash' | 'Loan'>('Cash');

  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Backup hours needed</label>
        <input
          type="range"
          min={1} max={48} step={1}
          value={backupHours}
          onChange={(e) => setBackupHours(+e.target.value)}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#4F8F73]"
          style={{ background: `linear-gradient(to right, #4F8F73 ${(backupHours / 48) * 100}%, #e5e7eb ${(backupHours / 48) * 100}%)` }}
        />
        <p className="text-xs text-gray-500 mt-1 text-center">{backupHours} hrs</p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Primary use</label>
        <div className="flex gap-2">
          {(['Backup power', 'Solar + Storage'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setPrimaryUse(opt)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                primaryUse === opt
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
