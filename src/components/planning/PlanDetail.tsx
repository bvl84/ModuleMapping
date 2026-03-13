'use client';

import { useState } from 'react';
import type { Plan, PlanCategory, PlanUpgrade, TierName } from '../../types/scoring';
import { SolarPersonalizer } from './personalizers/SolarPersonalizer';
import { HvacPersonalizer } from './personalizers/HvacPersonalizer';
import { BatteryPersonalizer } from './personalizers/BatteryPersonalizer';
import { DefaultPersonalizer } from './personalizers/DefaultPersonalizer';
import { SavingsChart } from './SavingsChart';

interface PlanDetailProps {
  plan: Plan;
  selectedUpgradeId: string | null;
  onSelectUpgrade: (id: string) => void;
  efficiencyScore: number;
  tier: TierName;
  onBack: () => void;
}

const BADGE_COLORS = {
  health: 'bg-rose-100 text-rose-700',
  wellness: 'bg-emerald-100 text-emerald-700',
  greenLiving: 'bg-teal-100 text-teal-700',
};

function PointBadge({ value, color }: { value: number; color: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${color}`}>
      <span className="text-[8px]">●</span>+{value}
    </span>
  );
}

function getPersonalizer(upgradeId: string | null) {
  switch (upgradeId) {
    case 'solar_installation':
      return SolarPersonalizer;
    case 'hvac_upgrade':
      return HvacPersonalizer;
    case 'battery':
    case 'led_lighting':
      return BatteryPersonalizer;
    default:
      return DefaultPersonalizer;
  }
}

function getChartType(upgradeId: string | null): 'solar' | 'hvac' | 'battery' {
  switch (upgradeId) {
    case 'solar_installation':
      return 'solar';
    case 'hvac_upgrade':
      return 'hvac';
    default:
      return 'battery';
  }
}

export function PlanDetail({
  plan,
  selectedUpgradeId,
  onSelectUpgrade,
  efficiencyScore,
  onBack,
}: PlanDetailProps) {
  const projectedScore = efficiencyScore + plan.totalBoost;
  const selectedUpgrade = plan.upgrades.find(u => u.id === selectedUpgradeId) ?? plan.upgrades[0];
  const PersonalizerComponent = getPersonalizer(selectedUpgradeId);
  const chartType = getChartType(selectedUpgradeId);

  const isSolarOrEnergy = selectedUpgradeId === 'solar_installation' || selectedUpgradeId === 'led_lighting';

  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
      >
        ← Back to Plans
      </button>

      <div className="flex gap-8">
        {/* Left sidebar - score projection */}
        <div className="flex-shrink-0 w-36">
          <p className="text-sm text-gray-500 mb-1">Efficient Score:</p>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-light text-gray-400">{efficiencyScore}</span>
            <span className="text-2xl text-gray-400">→</span>
            <span className="text-4xl font-light text-[#4F8F73]">{projectedScore}</span>
          </div>
          <div className="mt-3">
            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#4F8F73] transition-all duration-700"
                style={{ width: `${Math.min(100, (projectedScore / 200) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1">
          {/* Filter tags */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              We&apos;ve tailored custom plans to help your overall home health score.
            </p>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${BADGE_COLORS.health}`}>
                <span className="text-[8px]">●</span> Health
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${BADGE_COLORS.wellness}`}>
                <span className="text-[8px]">●</span> Wellness
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${BADGE_COLORS.greenLiving}`}>
                <span className="text-[8px]">●</span> Green Living
              </span>
            </div>
          </div>

          {/* Plan header */}
          <div className="border border-gray-200 rounded-xl p-5 bg-white mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">{plan.icon}</span>
                <h3 className="text-base font-medium text-gray-900">{plan.label}</h3>
              </div>
              <span className="text-3xl font-light text-[#4F8F73]">{plan.totalBoost}</span>
            </div>

            {/* Upgrade cards */}
            <div className="grid grid-cols-3 gap-3">
              {plan.upgrades.map((upgrade) => {
                const isSelected = upgrade.id === selectedUpgrade?.id;
                return (
                  <button
                    key={upgrade.id}
                    onClick={() => onSelectUpgrade(upgrade.id)}
                    className={`border rounded-lg p-3 text-left transition-all ${
                      isSelected
                        ? 'border-[#4F8F73] bg-[#f0f9f4] ring-1 ring-[#4F8F73]'
                        : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{upgrade.label}</span>
                    </div>
                    <div className="flex gap-1 mb-2">
                      <PointBadge value={upgrade.healthPts} color={BADGE_COLORS.health} />
                      <PointBadge value={upgrade.wellnessPts} color={BADGE_COLORS.wellness} />
                      <PointBadge value={upgrade.greenLivingPts} color={BADGE_COLORS.greenLiving} />
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{upgrade.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase">Savings</p>
                        <p className="text-xs text-gray-600">{'$'.repeat(upgrade.savingsLevel)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase">Upfront Cost</p>
                        <p className="text-xs text-gray-600">{'$'.repeat(upgrade.upfrontCostLevel)}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personalizer + Chart */}
          <div className="grid grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-xl p-5 bg-white">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Personalize</h4>
              <PersonalizerComponent />
            </div>
            <div>
              <SavingsChart type={chartType} />
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6">
            {isSolarOrEnergy ? (
              <button className="w-full py-3 bg-[#4F8F73] text-white rounded-xl text-sm font-medium hover:bg-[#3d7259] transition-colors">
                Begin Solar Journey
              </button>
            ) : (
              <button className="w-full py-3 border-2 border-[#4F8F73] text-[#4F8F73] rounded-xl text-sm font-medium hover:bg-[#f0f9f4] transition-colors">
                View Savings
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
