'use client';

import type { TierName } from '../../types/scoring';
import { TIERS } from '../../lib/scoring-constants';

interface EfficiencyScoreProps {
  score: number;
  tier: TierName;
  areaPercentile: number;
  address: string;
}

export function EfficiencyScore({ score, tier, areaPercentile, address }: EfficiencyScoreProps) {
  const tierIndex = TIERS.findIndex(t => t.name === tier);
  const progressPct = Math.min(100, (score / 200) * 100);

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg text-gray-500 font-normal">Home Efficiency Score:</h2>
          <p className="text-5xl font-light text-gray-900 mt-1">{score}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Top {areaPercentile}% of homes in your area</p>
          <div className="flex items-center gap-1.5 justify-end mt-1">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#4F8F73]">
              <path d="M7 1C4.5 1 2 3.5 2 6.5c0 2.5 2 4.5 5 7.5 3-3 5-5 5-7.5C12 3.5 9.5 1 7 1z" fill="currentColor"/>
              <circle cx="7" cy="6" r="2" fill="white"/>
            </svg>
            <span className="text-sm text-[#4F8F73] font-medium">{address}</span>
          </div>
        </div>
      </div>

      {/* Tier progress bar */}
      <div className="relative mb-1">
        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#4F8F73] transition-all duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Tier labels */}
      <div className="flex justify-between mt-2">
        {TIERS.map((t, i) => (
          <span
            key={t.name}
            className={`text-xs ${i <= tierIndex ? 'text-gray-700 font-medium' : 'text-gray-400'}`}
          >
            {t.name} Tier
          </span>
        ))}
      </div>
    </div>
  );
}
