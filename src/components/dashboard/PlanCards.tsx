'use client';

import type { Plan, PlanCategory } from '../../types/scoring';

interface PlanCardsProps {
  plans: Plan[];
  onViewDetails: (planId: PlanCategory) => void;
}

const PLAN_ICONS: Record<PlanCategory, { icon: string; bgColor: string; borderColor: string }> = {
  energy: { icon: '⚡', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  comfort: { icon: '🛋️', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  health: { icon: '💚', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
};

const PLAN_COLORS: Record<PlanCategory, string> = {
  energy: 'text-amber-600',
  comfort: 'text-blue-600',
  health: 'text-emerald-600',
};

export function PlanCards({ plans, onViewDetails }: PlanCardsProps) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-3">
        We&apos;ve tailored custom plans to help improve your efficiency score.
      </p>
      <div className="grid grid-cols-3 gap-4">
        {plans.map((plan) => {
          const config = PLAN_ICONS[plan.id];
          const scoreColor = PLAN_COLORS[plan.id];
          return (
            <div
              key={plan.id}
              className={`border ${config.borderColor} rounded-xl p-4 bg-white hover:shadow-md transition-shadow cursor-pointer`}
              onClick={() => onViewDetails(plan.id)}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 ${config.bgColor} rounded-lg flex items-center justify-center text-sm`}>
                  {config.icon}
                </div>
                <span className="text-sm font-medium text-gray-900">{plan.label}</span>
              </div>
              <p className={`text-3xl font-light ${scoreColor} mb-3`}>{plan.score}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(plan.id);
                }}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
              >
                View Details <span className="text-xs">›</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
