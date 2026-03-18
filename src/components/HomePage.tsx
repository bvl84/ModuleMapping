'use client';

import { useAppStore } from '../lib/useAppStore';
import { Header } from './layout/Header';
import { TabNav } from './layout/TabNav';
import { EfficiencyScore } from './dashboard/EfficiencyScore';
import { PlanCards } from './dashboard/PlanCards';
import { FilterPromo } from './dashboard/FilterPromo';
import { SystemStatusPanel } from './dashboard/SystemStatus';
import { DevicesPanel } from './dashboard/DevicesPanel';
import { ProfileCustomization } from './dashboard/ProfileCustomization';
import { PlanningOverview } from './planning/PlanningOverview';
import { PlanDetail } from './planning/PlanDetail';
import { ScoringBreakdown } from './scoring/ScoringBreakdown';

export function HomePage() {
  const {
    profile,
    activeTab,
    setActiveTab,
    selectedPlan,
    selectPlan,
    selectedUpgradeId,
    selectUpgrade,
    getSelectedPlan,
  } = useAppStore();

  const handleViewDetails = (planId: 'energy' | 'comfort' | 'health') => {
    selectPlan(planId);
    setActiveTab('planning');
  };

  const selectedPlanData = getSelectedPlan();

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <Header
          name={profile.name}
          temperature={profile.temperature}
          date={profile.date}
        />

        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* ═══════ DASHBOARD ═══════ */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Main content (left 2 cols) */}
            <div className="col-span-2 space-y-6">
              <EfficiencyScore
                score={profile.efficiencyScore}
                tier={profile.tier}
                areaPercentile={profile.areaPercentile}
                address={profile.address}
              />

              <PlanCards
                plans={profile.plans}
                onViewDetails={handleViewDetails}
              />

              <div className="h-px bg-gray-200" />

              <DevicesPanel devices={profile.devices} />
            </div>

            {/* Sidebar (right col) */}
            <div className="space-y-4">
              <ProfileCustomization />
              <FilterPromo />
              <SystemStatusPanel systems={profile.systems} />
            </div>
          </div>
        )}

        {/* ═══════ PLANNING ═══════ */}
        {activeTab === 'planning' && !selectedPlanData && (
          <PlanningOverview
            efficiencyScore={profile.efficiencyScore}
            tier={profile.tier}
            plans={profile.plans}
            onSelectPlan={selectPlan}
          />
        )}

        {activeTab === 'planning' && selectedPlanData && (
          <PlanDetail
            plan={selectedPlanData}
            selectedUpgradeId={selectedUpgradeId}
            onSelectUpgrade={selectUpgrade}
            efficiencyScore={profile.efficiencyScore}
            tier={profile.tier}
            onBack={() => selectPlan(null)}
          />
        )}

        {/* ═══════ SCORING ═══════ */}
        {activeTab === 'scoring' && <ScoringBreakdown />}

        {/* ═══════ CONFIG PROFILES ═══════ */}
        {activeTab === 'config' && (
          <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: 'calc(100vh - 160px)' }}>
            <iframe
              src="/config-profiles.html"
              className="w-full h-full border-0"
              title="Config Profiles"
            />
          </div>
        )}
      </div>
    </div>
  );
}
