'use client';

import { useState } from 'react';

interface SavingsChartProps {
  type: 'solar' | 'hvac' | 'battery';
}

const PERIODS = ['1 Month', '1 Year', '10 Years', '20 Years'] as const;

interface ChartData {
  withUpgrade: number;
  withoutUpgrade: number;
  label: string;
  savingsText: string;
  paybackText: string;
}

const CHART_DATA: Record<string, Record<typeof PERIODS[number], ChartData>> = {
  solar: {
    '1 Month': { withUpgrade: 120, withoutUpgrade: 280, label: 'Electricity cost', savingsText: '$47', paybackText: '12 years' },
    '1 Year': { withUpgrade: 1440, withoutUpgrade: 3360, label: 'Electricity cost', savingsText: '$564', paybackText: '12 years' },
    '10 Years': { withUpgrade: 14400, withoutUpgrade: 38000, label: 'Electricity cost', savingsText: '$23,600', paybackText: '12 years' },
    '20 Years': { withUpgrade: 28800, withoutUpgrade: 82000, label: 'Electricity cost', savingsText: '$53,200', paybackText: '12 years' },
  },
  hvac: {
    '1 Month': { withUpgrade: 95, withoutUpgrade: 260, label: 'Heating/Cooling cost', savingsText: '$47', paybackText: '12 years' },
    '1 Year': { withUpgrade: 1140, withoutUpgrade: 3120, label: 'Heating/Cooling cost', savingsText: '$564', paybackText: '12 years' },
    '10 Years': { withUpgrade: 11400, withoutUpgrade: 35000, label: 'Heating/Cooling cost', savingsText: '$23,600', paybackText: '12 years' },
    '20 Years': { withUpgrade: 22800, withoutUpgrade: 76000, label: 'Heating/Cooling cost', savingsText: '$53,200', paybackText: '12 years' },
  },
  battery: {
    '1 Month': { withUpgrade: 100, withoutUpgrade: 240, label: 'Energy cost', savingsText: '$47', paybackText: '12 years' },
    '1 Year': { withUpgrade: 1200, withoutUpgrade: 2880, label: 'Energy cost', savingsText: '$564', paybackText: '12 years' },
    '10 Years': { withUpgrade: 12000, withoutUpgrade: 32000, label: 'Energy cost', savingsText: '$23,600', paybackText: '12 years' },
    '20 Years': { withUpgrade: 24000, withoutUpgrade: 70000, label: 'Energy cost', savingsText: '$53,200', paybackText: '12 years' },
  },
};

const UPGRADE_LABELS: Record<string, { with: string; without: string }> = {
  solar: { with: 'Electricity cost with solar', without: 'Electricity cost without solar' },
  hvac: { with: 'Cost with Heat Pump', without: 'Cost with current system' },
  battery: { with: 'System Capacity', without: 'Avg. home daily usage' },
};

export function SavingsChart({ type }: SavingsChartProps) {
  const [period, setPeriod] = useState<typeof PERIODS[number]>('1 Month');
  const data = CHART_DATA[type][period];
  const labels = UPGRADE_LABELS[type];

  const maxVal = Math.max(data.withUpgrade, data.withoutUpgrade);
  const withPct = (data.withUpgrade / maxVal) * 100;
  const withoutPct = (data.withoutUpgrade / maxVal) * 100;

  const isBattery = type === 'battery';

  return (
    <div>
      {/* Summary text */}
      <div className="bg-[#4F8F73] text-white rounded-t-xl px-4 py-3">
        <p className="text-sm">
          Your {period.toLowerCase()} projected energy savings is <span className="font-semibold">{data.savingsText}</span> with a payback of <span className="font-semibold">{data.paybackText}</span>
        </p>
      </div>

      <div className="border border-t-0 border-gray-200 rounded-b-xl p-5 bg-white">
        {/* Period tabs */}
        <div className="flex gap-0 mb-6 border-b border-gray-100">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`pb-2 px-3 text-xs font-medium border-b-2 transition-colors ${
                period === p
                  ? 'text-gray-900 border-gray-900'
                  : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {isBattery ? (
          <>
            {/* Battery-style horizontal bar */}
            <div className="mb-6">
              <div className="h-8 rounded-lg bg-[#4F8F73] overflow-hidden mb-1" style={{ width: `${withPct}%` }} />
              <div className="flex justify-between text-xs text-gray-500 mb-4">
                <span>01 hrs</span>
                <span>12 hrs</span>
                <span>24 hrs</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">{labels.with}</p>
                <div className="h-8 rounded-lg overflow-hidden bg-gray-100">
                  <div className="h-full rounded-lg bg-[#4F8F73]" style={{ width: `${withPct}%` }} />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">{labels.without}</p>
                <div className="h-8 rounded-lg overflow-hidden bg-gray-100">
                  <div className="h-full rounded-lg bg-[#b8d4c8]" style={{ width: `${withoutPct}%` }} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Bar chart */}
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">{labels.with}</p>
                <div className="h-10 rounded-lg overflow-hidden bg-gray-100">
                  <div
                    className="h-full rounded-lg bg-[#4F8F73] transition-all duration-500"
                    style={{ width: `${withPct}%` }}
                  />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">{labels.without}</p>
                <div className="h-10 rounded-lg overflow-hidden bg-gray-100">
                  <div
                    className="h-full rounded-lg bg-[#b8d4c8] transition-all duration-500"
                    style={{ width: `${withoutPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between mt-3 text-xs text-gray-400">
              {['$0', '$60', '$120', '$180', '$240', '$300', '$360', '$420'].map(v => (
                <span key={v}>{v}</span>
              ))}
            </div>
          </>
        )}

        {/* Savings note */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-900 mb-1">Your Savings</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            While the actual savings from a rooftop solar systems depends on many different factors, solar can cut your electric bills and help insulate you from rate hikes.
          </p>
        </div>
      </div>
    </div>
  );
}
