'use client';

import { useState, useCallback } from 'react';
import type { UserProfile, PlanCategory, TierName } from '../types/scoring';
import { getTier, PLANS, DEFAULT_DEVICES, DEFAULT_SYSTEMS } from './scoring-constants';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Micheal Smith',
  address: '12345 Street Address Rd',
  temperature: 64,
  date: 'Monday, January 19th',
  efficiencyScore: 84,
  tier: 'Entry' as TierName,
  areaPercentile: 15,
  plans: PLANS,
  devices: DEFAULT_DEVICES,
  systems: DEFAULT_SYSTEMS,
};

export function useAppStore() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [selectedPlan, setSelectedPlan] = useState<PlanCategory | null>(null);
  const [selectedUpgradeId, setSelectedUpgradeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'planning'>('dashboard');

  const selectPlan = useCallback((planId: PlanCategory | null) => {
    setSelectedPlan(planId);
    if (planId) {
      const plan = PLANS.find(p => p.id === planId);
      if (plan && plan.upgrades.length > 0) {
        setSelectedUpgradeId(plan.upgrades[0].id);
      }
    } else {
      setSelectedUpgradeId(null);
    }
  }, []);

  const selectUpgrade = useCallback((upgradeId: string) => {
    setSelectedUpgradeId(upgradeId);
  }, []);

  const getSelectedPlan = useCallback(() => {
    return PLANS.find(p => p.id === selectedPlan) ?? null;
  }, [selectedPlan]);

  const getSelectedUpgrade = useCallback(() => {
    const plan = PLANS.find(p => p.id === selectedPlan);
    if (!plan) return null;
    return plan.upgrades.find(u => u.id === selectedUpgradeId) ?? null;
  }, [selectedPlan, selectedUpgradeId]);

  const getProjectedScore = useCallback(() => {
    const plan = PLANS.find(p => p.id === selectedPlan);
    if (!plan) return profile.efficiencyScore;
    return Math.min(200, profile.efficiencyScore + plan.totalBoost);
  }, [selectedPlan, profile.efficiencyScore]);

  const currentTierData = getTier(profile.efficiencyScore * 3);

  return {
    profile,
    setProfile,
    activeTab,
    setActiveTab,
    selectedPlan,
    selectPlan,
    selectedUpgradeId,
    selectUpgrade,
    getSelectedPlan,
    getSelectedUpgrade,
    getProjectedScore,
    currentTierData,
  };
}
