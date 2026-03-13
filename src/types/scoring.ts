export type TierName = 'Entry' | 'Silver' | 'Gold' | 'Platinum';

export interface Tier {
  name: TierName;
  minPts: number;
  maxPts: number;
  color: string;
  textColor: string;
  bgColor: string;
}

export type PlanCategory = 'energy' | 'comfort' | 'health';

export interface PlanUpgrade {
  id: string;
  label: string;
  description: string;
  planCategory: PlanCategory;
  healthPts: number;
  wellnessPts: number;
  greenLivingPts: number;
  savingsLevel: number;     // 1-5
  upfrontCostLevel: number; // 1-5
  icon: string;
}

export interface Plan {
  id: PlanCategory;
  label: string;
  icon: string;
  score: number;
  totalBoost: number;
  upgrades: PlanUpgrade[];
}

export interface Device {
  id: string;
  name: string;
  icon: string;
  status: 'Online' | 'Offline';
  value?: string;
}

export interface SystemStatus {
  id: string;
  name: string;
  icon: string;
  status: 'Live' | 'Offline';
  activity: string;
}

export interface UserProfile {
  name: string;
  address: string;
  temperature: number;
  date: string;
  efficiencyScore: number;
  tier: TierName;
  areaPercentile: number;
  plans: Plan[];
  devices: Device[];
  systems: SystemStatus[];
}

export interface SolarPersonalization {
  monthlyBill: number;
  roofSlope: number;
  roofShade: number;
  financing: 'Cash' | 'Loan' | 'Lease';
}

export interface HvacPersonalization {
  existingDuctwork: boolean;
  systemAge: number;
  heatingFuel: 'Natural Gas' | 'Fuel Oil' | 'Propane' | 'Electric';
  financing: 'Cash' | 'Loan';
}

export interface BatteryPersonalization {
  backupHours: number;
  primaryUse: 'Backup power' | 'Solar + Storage';
  financing: 'Cash' | 'Loan';
}

export type ActivityCategory =
  | 'major_install'
  | 'maintenance'
  | 'product_purchase'
  | 'engagement'
  | 'referral'
  | 'streak_bonus';

export interface PointActivity {
  id: string;
  label: string;
  category: ActivityCategory;
  points: number;
  effort: 'zero' | 'low' | 'medium' | 'high';
  icon: string;
  recurring: boolean;
  description: string;
}

export interface ActivityEntry {
  id: string;
  activityId: string;
  label: string;
  points: number;
  timestamp: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredTier: TierName;
  category: 'discount' | 'service' | 'product' | 'access' | 'support';
}
