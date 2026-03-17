import type {
  Tier,
  TierName,
  Plan,
  PlanUpgrade,
  Device,
  SystemStatus,
  PointActivity,
  Reward,
} from '../types/scoring';

export const TIERS: Tier[] = [
  {
    name: 'Entry',
    minPts: 0,
    maxPts: 75,
    color: '#4F8F73',
    textColor: 'text-emerald-800',
    bgColor: 'bg-emerald-50',
  },
  {
    name: 'Silver',
    minPts: 76,
    maxPts: 299,
    color: '#9CA3AF',
    textColor: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
  {
    name: 'Gold',
    minPts: 300,
    maxPts: 799,
    color: '#B8860B',
    textColor: 'text-yellow-800',
    bgColor: 'bg-yellow-50',
  },
  {
    name: 'Platinum',
    minPts: 800,
    maxPts: 99999,
    color: '#6B21A8',
    textColor: 'text-purple-800',
    bgColor: 'bg-purple-50',
  },
];

export const TIER_MAX_FOR_BAR = 1000;

export function getTier(points: number): Tier {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (points >= TIERS[i].minPts) return TIERS[i];
  }
  return TIERS[0];
}

export function getNextTier(current: TierName): Tier | null {
  const idx = TIERS.findIndex((t) => t.name === current);
  return idx < TIERS.length - 1 ? TIERS[idx + 1] : null;
}

export function getTierProgressPct(points: number): number {
  return Math.min(100, Math.round((points / TIER_MAX_FOR_BAR) * 100));
}

// ── Plan Upgrades ──

const ENERGY_UPGRADES: PlanUpgrade[] = [
  {
    id: 'solar_installation',
    label: 'Solar Installation',
    description: 'Generate clean energy and reduce electricity bills by up to 90%',
    planCategory: 'energy',
    healthPts: 5,
    wellnessPts: 10,
    greenLivingPts: 50,
    savingsLevel: 5,
    upfrontCostLevel: 5,
    icon: '☀️',
  },
  {
    id: 'hvac_upgrade',
    label: 'HVAC Upgrade',
    description: 'Modern heat pump system for a better efficiency',
    planCategory: 'energy',
    healthPts: 20,
    wellnessPts: 10,
    greenLivingPts: 50,
    savingsLevel: 5,
    upfrontCostLevel: 5,
    icon: '🌡️',
  },
  {
    id: 'led_lighting',
    label: 'LED Lighting',
    description: 'Smart LED lighting throughout the home',
    planCategory: 'energy',
    healthPts: 20,
    wellnessPts: 10,
    greenLivingPts: 50,
    savingsLevel: 5,
    upfrontCostLevel: 5,
    icon: '💡',
  },
];

const COMFORT_UPGRADES: PlanUpgrade[] = [
  {
    id: 'smart_thermostat',
    label: 'Smart Thermostat',
    description: 'Precise temperature control and scheduling',
    planCategory: 'comfort',
    healthPts: 20,
    wellnessPts: 10,
    greenLivingPts: 50,
    savingsLevel: 5,
    upfrontCostLevel: 4,
    icon: '📱',
  },
  {
    id: 'air_filtration',
    label: 'Air Filtration',
    description: 'Advanced air purification system',
    planCategory: 'comfort',
    healthPts: 20,
    wellnessPts: 10,
    greenLivingPts: 50,
    savingsLevel: 5,
    upfrontCostLevel: 4,
    icon: '🌬️',
  },
  {
    id: 'zoned_hvac',
    label: 'Zoned HVAC',
    description: 'Individual room temperature control',
    planCategory: 'comfort',
    healthPts: 20,
    wellnessPts: 10,
    greenLivingPts: 50,
    savingsLevel: 5,
    upfrontCostLevel: 4,
    icon: '🏠',
  },
];

const HEALTH_UPGRADES: PlanUpgrade[] = [
  {
    id: 'water_filtration',
    label: 'Water Filtration',
    description: 'Whole-home water purification system',
    planCategory: 'health',
    healthPts: 20,
    wellnessPts: 10,
    greenLivingPts: 50,
    savingsLevel: 5,
    upfrontCostLevel: 5,
    icon: '💧',
  },
  {
    id: 'air_quality_monitor',
    label: 'Air Quality Monitor',
    description: 'Real-time air quality tracking and alerts',
    planCategory: 'health',
    healthPts: 20,
    wellnessPts: 10,
    greenLivingPts: 50,
    savingsLevel: 5,
    upfrontCostLevel: 5,
    icon: '📊',
  },
  {
    id: 'uv_air_purifier',
    label: 'UV Air Purifier',
    description: 'Eliminate bacteria and viruses from air',
    planCategory: 'health',
    healthPts: 20,
    wellnessPts: 10,
    greenLivingPts: 50,
    savingsLevel: 5,
    upfrontCostLevel: 5,
    icon: '🔆',
  },
];

export const PLANS: Plan[] = [
  {
    id: 'energy',
    label: 'Energy Plan',
    icon: '⚡',
    score: 88,
    totalBoost: 72,
    upgrades: ENERGY_UPGRADES,
  },
  {
    id: 'comfort',
    label: 'Comfort Plan',
    icon: '🛋️',
    score: 92,
    totalBoost: 68,
    upgrades: COMFORT_UPGRADES,
  },
  {
    id: 'health',
    label: 'Health Plan',
    icon: '💚',
    score: 96,
    totalBoost: 78,
    upgrades: HEALTH_UPGRADES,
  },
];

export const DEFAULT_DEVICES: Device[] = [
  { id: 'thermostat', name: 'Thermostat', icon: '🌡️', status: 'Online', value: '72' },
  { id: 'air_purifier', name: 'Air Purifier', icon: '🌬️', status: 'Online' },
];

export const DEFAULT_SYSTEMS: SystemStatus[] = [
  { id: 'hvac', name: 'HVAC System', icon: '❄️', status: 'Live', activity: 'Cooling' },
  { id: 'battery', name: 'Battery Storage', icon: '🔋', status: 'Live', activity: 'Charging' },
  { id: 'solar', name: 'Solar Panels', icon: '☀️', status: 'Live', activity: 'Charging' },
];

export const POINT_ACTIVITIES: PointActivity[] = [
  { id: 'heat_pump', label: 'Heat pump system installed', category: 'major_install', points: 310, effort: 'high', icon: '🌡️', recurring: false, description: 'Full heat pump installation' },
  { id: 'solar', label: 'Solar panels installed', category: 'major_install', points: 310, effort: 'high', icon: '☀️', recurring: false, description: 'Rooftop solar panel system' },
  { id: 'battery', label: 'Home battery storage', category: 'major_install', points: 125, effort: 'high', icon: '🔋', recurring: false, description: 'Backup home energy storage' },
  { id: 'ev_charger', label: 'EV charger installed', category: 'major_install', points: 75, effort: 'high', icon: '🚗', recurring: false, description: 'Level 2 home EV charger' },
  { id: 'filter_purchase', label: 'Air filter purchased (MERV 11+)', category: 'product_purchase', points: 15, effort: 'low', icon: '🌬️', recurring: true, description: 'High-efficiency filter' },
  { id: 'annual_maintenance', label: 'Annual maintenance visit', category: 'maintenance', points: 50, effort: 'medium', icon: '🧼', recurring: true, description: 'Professional tune-up' },
  { id: 'daily_checkin', label: 'Daily check-in', category: 'engagement', points: 5, effort: 'zero', icon: '📋', recurring: true, description: 'Confirm system running well' },
  { id: 'installer_review', label: 'Installer review submitted', category: 'engagement', points: 10, effort: 'zero', icon: '⭐', recurring: true, description: '30-second review form' },
  { id: 'energy_bill', label: 'Energy bill logged', category: 'engagement', points: 8, effort: 'zero', icon: '⚡', recurring: true, description: 'Monthly bill entry' },
  { id: 'health_quiz', label: 'Home health quiz completed', category: 'engagement', points: 20, effort: 'zero', icon: '📊', recurring: true, description: 'Personalized home report' },
  { id: 'referral', label: 'Successful referral', category: 'referral', points: 50, effort: 'low', icon: '👥', recurring: true, description: 'Friend completes a purchase' },
  { id: 'streak_7', label: '7-day check-in streak', category: 'streak_bonus', points: 25, effort: 'zero', icon: '🔥', recurring: true, description: '7 consecutive daily check-ins' },
  { id: 'streak_30', label: '30-day check-in streak', category: 'streak_bonus', points: 75, effort: 'zero', icon: '🏆', recurring: true, description: '30 consecutive daily check-ins' },
  { id: 'streak_90', label: '90-day check-in streak', category: 'streak_bonus', points: 200, effort: 'zero', icon: '💫', recurring: true, description: '90 consecutive daily check-ins' },
];

export const REWARDS: Reward[] = [
  { id: 'dashboard_access', title: 'Home score dashboard', description: 'Health, comfort, and green scores tracked', icon: '📊', requiredTier: 'Entry', category: 'access' },
  { id: 'rebate_guidance', title: 'Rebate guidance', description: 'IRA, state & utility rebate tracker', icon: '📖', requiredTier: 'Entry', category: 'service' },
  { id: 'priority_support', title: 'Priority support', description: 'Dedicated support line', icon: '🎧', requiredTier: 'Silver', category: 'support' },
  { id: 'accessory_discount', title: '5% off accessories', description: 'Filters, thermostats, and IAQ products', icon: '🏷️', requiredTier: 'Silver', category: 'discount' },
  { id: 'extended_warranty', title: 'Extended warranty', description: '+2 years on heat pump parts & labor', icon: '🛡️', requiredTier: 'Gold', category: 'service' },
  { id: 'free_filter_delivery', title: 'Free filter delivery', description: 'Quarterly filter shipment', icon: '📦', requiredTier: 'Gold', category: 'product' },
  { id: 'vip_dispatch', title: 'VIP installer dispatch', description: 'Top-rated installer, same-week scheduling', icon: '💎', requiredTier: 'Platinum', category: 'service' },
  { id: 'double_referral', title: '2× referral bonus', description: 'Earn 100 pts per referral', icon: '✖️', requiredTier: 'Platinum', category: 'discount' },
];

export const QUICK_WIN_IDS = [
  'daily_checkin',
  'installer_review',
  'energy_bill',
  'health_quiz',
];

export const TIER_ORDER: TierName[] = ['Entry', 'Silver', 'Gold', 'Platinum'];

export function tierRank(name: TierName): number {
  return TIER_ORDER.indexOf(name);
}

export function isRewardUnlocked(reward: Reward, currentTier: TierName): boolean {
  return tierRank(currentTier) >= tierRank(reward.requiredTier);
}
