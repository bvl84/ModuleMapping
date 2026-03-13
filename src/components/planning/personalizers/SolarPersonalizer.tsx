'use client';

import { useState } from 'react';

export function SolarPersonalizer() {
  const [monthlyBill, setMonthlyBill] = useState(40);
  const [roofSlope, setRoofSlope] = useState(35);
  const [roofShade, setRoofShade] = useState(50);
  const [financing, setFinancing] = useState<'Cash' | 'Loan' | 'Lease'>('Cash');

  const billLabel = monthlyBill < 30 ? 'Low' : monthlyBill < 60 ? 'Some' : 'High';
  const slopeLabel = roofSlope < 30 ? 'Flat' : roofSlope < 60 ? 'Some' : 'Steep';
  const shadeLabel = roofShade < 30 ? 'Low' : roofShade < 60 ? 'Moderate' : 'Heavy';

  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Monthly electric bill</label>
        <input
          type="range"
          min={0} max={100} step={1}
          value={monthlyBill}
          onChange={(e) => setMonthlyBill(+e.target.value)}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#4F8F73]"
          style={{ background: `linear-gradient(to right, #4F8F73 ${monthlyBill}%, #e5e7eb ${monthlyBill}%)` }}
        />
        <p className="text-xs text-gray-500 mt-1 text-center">{billLabel}</p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Roof Slope</label>
        <input
          type="range"
          min={0} max={100} step={1}
          value={roofSlope}
          onChange={(e) => setRoofSlope(+e.target.value)}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#4F8F73]"
          style={{ background: `linear-gradient(to right, #4F8F73 ${roofSlope}%, #e5e7eb ${roofSlope}%)` }}
        />
        <p className="text-xs text-gray-500 mt-1 text-center">{slopeLabel}</p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Roof Shade</label>
        <input
          type="range"
          min={0} max={100} step={1}
          value={roofShade}
          onChange={(e) => setRoofShade(+e.target.value)}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#4F8F73]"
          style={{ background: `linear-gradient(to right, #4F8F73 ${roofShade}%, #e5e7eb ${roofShade}%)` }}
        />
        <p className="text-xs text-gray-500 mt-1 text-center">{shadeLabel}</p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Financing</label>
        <div className="flex gap-2">
          {(['Cash', 'Loan', 'Lease'] as const).map((opt) => (
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
