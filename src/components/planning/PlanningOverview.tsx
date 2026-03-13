'use client';

import type { Plan, PlanCategory, TierName } from '../../types/scoring';
import { TIERS } from '../../lib/scoring-constants';

interface PlanningOverviewProps {
  efficiencyScore: number;
  tier: TierName;
  plans: Plan[];
  onSelectPlan: (planId: PlanCategory) => void;
}

const BADGE_COLORS = {
  health: 'bg-rose-100 text-rose-700',
  wellness: 'bg-emerald-100 text-emerald-700',
  greenLiving: 'bg-teal-100 text-teal-700',
};

function PointBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${color}`}>
      <span className="text-[8px]">●</span>+{value}
    </span>
  );
}

export function PlanningOverview({ efficiencyScore, tier, plans, onSelectPlan }: PlanningOverviewProps) {
  const tierIndex = TIERS.findIndex(t => t.name === tier);
  const progressPct = Math.min(100, (efficiencyScore / 200) * 100);

  return (
    <div className="flex gap-8">
      {/* Left sidebar - score */}
      <div className="flex-shrink-0 w-36">
        <p className="text-sm text-gray-500 mb-1">Efficient Score:</p>
        <p className="text-5xl font-light text-gray-900">{efficiencyScore}</p>
        <div className="mt-3">
          <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#4F8F73] transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{tier} Tier</p>
        </div>
      </div>

      {/* Right content - plans */}
      <div className="flex-1">
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

        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelectPlan(plan.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{plan.icon}</span>
                  <h3 className="text-base font-medium text-gray-900">{plan.label}</h3>
                </div>
                <span className="text-2xl font-light text-[#4F8F73]">+{plan.totalBoost}</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {plan.upgrades.map((upgrade) => (
                  <div
                    key={upgrade.id}
                    className="border border-gray-100 rounded-lg p-3 hover:border-[#4F8F73] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{upgrade.label}</span>
                    </div>
                    <div className="flex gap-1 mb-2">
                      <PointBadge label="H" value={upgrade.healthPts} color={BADGE_COLORS.health} />
                      <PointBadge label="W" value={upgrade.wellnessPts} color={BADGE_COLORS.wellness} />
                      <PointBadge label="G" value={upgrade.greenLivingPts} color={BADGE_COLORS.greenLiving} />
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{upgrade.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase">Savings</p>
                        <p className="text-xs text-gray-600">{'$'.repeat(upgrade.savingsLevel)}{'$'.repeat(5 - upgrade.savingsLevel).split('').map(() => ' ').join('')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase">Upfront Cost</p>
                        <p className="text-xs text-gray-600">{'$'.repeat(upgrade.upfrontCostLevel)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
