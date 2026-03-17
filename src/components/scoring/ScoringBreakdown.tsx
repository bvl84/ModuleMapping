'use client';

import { useState, useCallback } from 'react';
import {
  TIERS,
  POINT_ACTIVITIES,
  REWARDS,
  QUICK_WIN_IDS,
  getTier,
  getNextTier,
  getTierProgressPct,
  isRewardUnlocked,
  TIER_MAX_FOR_BAR,
} from '../../lib/scoring-constants';
import type { TierName, ActivityCategory, ActivityEntry } from '../../types/scoring';

// ── Default scoring state ──

const DEFAULT_STATE = {
  totalPoints: 240,
  currentTier: 'Silver' as TierName,
  healthScore: 70,
  comfortScore: 50,
  greenScore: 30,
  streakDays: 4,
  completedTodayIds: [] as string[],
  activityLog: [
    { id: '1', activityId: 'heat_pump', label: 'Heat pump installed', points: 310, timestamp: '2026-02-10T10:00:00Z' },
    { id: '2', activityId: 'filter_purchase', label: 'Filter purchase — MERV 11', points: 15, timestamp: '2026-03-01T10:00:00Z' },
    { id: '3', activityId: 'installer_review', label: 'Installer review submitted', points: 10, timestamp: '2026-02-15T10:00:00Z' },
    { id: '4', activityId: 'daily_checkin', label: 'Daily check-in × 5', points: 25, timestamp: '2026-03-08T10:00:00Z' },
  ] as ActivityEntry[],
};

type ScoringTab = 'overview' | 'earn' | 'rewards' | 'tiers' | 'activity';

const SCORING_TABS: { id: ScoringTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'earn', label: 'Earn Points' },
  { id: 'rewards', label: 'Rewards' },
  { id: 'tiers', label: 'Tiers' },
  { id: 'activity', label: 'Activity' },
];

// ── Toast hook ──

function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const show = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2400);
  };
  return { message, show };
}

// ── Main component ──

export function ScoringBreakdown() {
  const [tab, setTab] = useState<ScoringTab>('overview');
  const [score, setScore] = useState(DEFAULT_STATE);
  const toast = useToast();

  const tier = getTier(score.totalPoints);
  const next = getNextTier(tier.name as TierName);
  const pct = getTierProgressPct(score.totalPoints);

  const earnPoints = useCallback((activityId: string) => {
    const activity = POINT_ACTIVITIES.find(a => a.id === activityId);
    if (!activity) return;
    if (score.completedTodayIds.includes(activityId)) {
      toast.show('Already completed today');
      return;
    }

    const newTotal = score.totalPoints + activity.points;
    const newTier = getTier(newTotal);
    let newStreak = score.streakDays;
    if (activityId === 'daily_checkin') newStreak += 1;

    setScore(prev => ({
      ...prev,
      totalPoints: newTotal,
      currentTier: newTier.name as TierName,
      streakDays: newStreak,
      completedTodayIds: [...prev.completedTodayIds, activityId],
      activityLog: [
        { id: Date.now().toString(), activityId, label: activity.label, points: activity.points, timestamp: new Date().toISOString() },
        ...prev.activityLog,
      ],
      healthScore: (activity.category === 'major_install' || activity.category === 'maintenance') ? Math.min(100, prev.healthScore + 5) : prev.healthScore,
      comfortScore: activity.category === 'product_purchase' ? Math.min(100, prev.comfortScore + 4) : prev.comfortScore,
      greenScore: ['solar', 'ev_charger', 'battery'].includes(activity.id) ? Math.min(100, prev.greenScore + 15) : activity.category === 'major_install' ? Math.min(100, prev.greenScore + 5) : prev.greenScore,
    }));

    toast.show(`+${activity.points} pts — ${activity.label}`);
  }, [score, toast]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Scoring Breakdown</h2>
          <p className="text-sm text-gray-500 mt-0.5">Track your points, tier, and rewards</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${tier.bgColor} ${tier.textColor}`}>
            {tier.name}
          </span>
          <span className="text-lg font-semibold text-gray-900">{score.totalPoints.toLocaleString()} pts</span>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 border-b border-gray-100 mb-6 overflow-x-auto">
        {SCORING_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`pb-2.5 px-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === t.id
                ? 'text-[#4F8F73] border-[#4F8F73]'
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
            style={{ marginBottom: '-1px' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ OVERVIEW ═══ */}
      {tab === 'overview' && (
        <div className="space-y-5">
          {/* Tier nudge */}
          {next && next.minPts - score.totalPoints <= 80 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-amber-900">{next.minPts - score.totalPoints} pts from {next.name}!</p>
                <p className="text-xs text-amber-700 mt-0.5">Complete a few tasks to level up.</p>
              </div>
              <button onClick={() => setTab('earn')} className="text-xs px-3 py-1.5 bg-amber-100 text-amber-900 rounded-lg font-medium hover:bg-amber-200 transition-colors flex-shrink-0">
                Earn now
              </button>
            </div>
          )}

          {/* Tier progress */}
          <div className="border border-gray-100 rounded-xl p-5 bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Tier progress</span>
              <span className="text-xs text-gray-500">
                {next ? `${score.totalPoints} / ${next.minPts} to ${next.name}` : 'Platinum — max tier'}
              </span>
            </div>
            <div className="flex gap-1 mb-2">
              {TIERS.map(t => (
                <div key={t.name} className={`flex-1 text-center text-[10px] font-medium py-1 px-1 rounded ${t.bgColor} ${t.textColor} ${t.name === tier.name ? 'ring-1 ring-offset-0 ring-current' : ''}`}>
                  {t.name}
                  <br />
                  <span className="opacity-60">{t.minPts}</span>
                </div>
              ))}
            </div>
            <div className="h-2.5 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
              <div className="h-full rounded-full bg-[#4F8F73] transition-all duration-700 ease-out" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* Score rings */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Health', value: score.healthScore, color: '#4F8F73' },
              { label: 'Comfort', value: score.comfortScore, color: '#3d7259' },
              { label: 'Green', value: score.greenScore, color: '#4F8F73' },
            ].map(ring => (
              <div key={ring.label} className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center">
                <p className="text-xs text-gray-500 mb-2">{ring.label}</p>
                <ScoreRing value={ring.value} color={ring.color} />
                <p className="text-xs text-gray-400 mt-1">/ 100</p>
              </div>
            ))}
          </div>

          {/* Streak */}
          <StreakTracker streakDays={score.streakDays} />

          {/* Quick wins */}
          <QuickWins completedIds={score.completedTodayIds} onEarn={earnPoints} />

          <button onClick={() => setTab('earn')} className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            All ways to earn points →
          </button>
        </div>
      )}

      {/* ═══ EARN ═══ */}
      {tab === 'earn' && <PointCatalog onEarn={earnPoints} completedIds={score.completedTodayIds} />}

      {/* ═══ REWARDS ═══ */}
      {tab === 'rewards' && <RewardsCatalog currentTier={score.currentTier} />}

      {/* ═══ TIERS ═══ */}
      {tab === 'tiers' && <TiersView currentPoints={score.totalPoints} />}

      {/* ═══ ACTIVITY ═══ */}
      {tab === 'activity' && <ActivityLog entries={score.activityLog} totalPoints={score.totalPoints} />}

      {/* Toast */}
      {toast.message && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#4F8F73] text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-lg z-50 pointer-events-none whitespace-nowrap">
          {toast.message}
        </div>
      )}
    </div>
  );
}

// ── Score Ring SVG ──

function ScoreRing({ value, color }: { value: number; color: string }) {
  const r = 32;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
      <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 40 40)" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
      <text x="40" y="44" textAnchor="middle" fontSize="16" fontWeight="500" fill="#1a1a1a">{value}</text>
    </svg>
  );
}

// ── Streak Tracker ──

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function StreakTracker({ streakDays }: { streakDays: number }) {
  const nextMilestone = streakDays >= 90 ? null : streakDays >= 30 ? 90 : streakDays >= 7 ? 30 : 7;
  const nextBonus = nextMilestone === 7 ? 25 : nextMilestone === 30 ? 75 : 200;

  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-white">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-medium">Check-in streak</p>
          <p className="text-xs text-gray-500 mt-0.5">5 pts/day · bonus at 7, 30, 90 days</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-medium">{streakDays}</p>
          <p className="text-xs text-gray-500">day streak</p>
        </div>
      </div>
      <div className="flex gap-1.5">
        {DAY_LABELS.map((day, i) => {
          const filled = i < (streakDays % 7 || (streakDays > 0 && streakDays % 7 === 0 ? 7 : 0));
          return (
            <div key={i} className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium border transition-colors ${
              filled ? 'bg-[#4F8F73] text-white border-[#4F8F73]' : 'bg-white text-gray-400 border-gray-200'
            }`}>
              {day}
            </div>
          );
        })}
      </div>
      {nextMilestone && (
        <p className="text-xs text-[#4F8F73] mt-2 font-medium">
          {nextMilestone - streakDays} more days → {nextMilestone}-day bonus (+{nextBonus} pts)
        </p>
      )}
      {!nextMilestone && (
        <p className="text-xs text-[#4F8F73] mt-2 font-medium">Max streak milestone reached — keep it going!</p>
      )}
    </div>
  );
}

// ── Quick Wins ──

function QuickWins({ completedIds, onEarn }: { completedIds: string[]; onEarn: (id: string) => void }) {
  const tasks = QUICK_WIN_IDS.map(id => POINT_ACTIVITIES.find(a => a.id === id)).filter(Boolean) as typeof POINT_ACTIVITIES;
  const doneCount = tasks.filter(t => completedIds.includes(t.id)).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium">Quick wins today</p>
        <p className="text-xs text-gray-500">{doneCount} / {tasks.length} done</p>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.map(task => {
          const done = completedIds.includes(task.id);
          return (
            <div key={task.id} className={`border border-gray-100 rounded-xl p-3 bg-white transition-opacity ${done ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#e8f5ee] flex items-center justify-center text-base flex-shrink-0">{task.icon}</div>
                  <div>
                    <p className="text-sm font-medium">{task.label}</p>
                    <p className="text-xs text-gray-500">{task.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs px-2 py-0.5 rounded font-medium bg-[#e8f5ee] text-[#2d6e50]">+{task.points} pts</span>
                  <button disabled={done} onClick={() => onEarn(task.id)} className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
                    {done ? 'Done ✓' : 'Go'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Point Catalog ──

const CATEGORY_LABELS: Record<ActivityCategory, string> = {
  major_install: 'Major Installs',
  maintenance: 'Maintenance',
  product_purchase: 'Products & Accessories',
  engagement: 'Engagement (Zero Effort)',
  referral: 'Referrals',
  streak_bonus: 'Streak Bonuses',
};

const EFFORT_STYLE: Record<string, string> = {
  zero: 'bg-[#e8f5ee] text-[#2d6e50]',
  low: 'bg-yellow-50 text-yellow-800',
  medium: 'bg-orange-50 text-orange-800',
  high: 'bg-red-50 text-red-800',
};

const EFFORT_LABEL: Record<string, string> = {
  zero: 'Zero effort',
  low: 'Low effort',
  medium: 'Medium',
  high: 'High value',
};

function PointCatalog({ onEarn, completedIds }: { onEarn: (id: string) => void; completedIds: string[] }) {
  const grouped = (Object.keys(CATEGORY_LABELS) as ActivityCategory[])
    .map(cat => ({ category: cat, label: CATEGORY_LABELS[cat], activities: POINT_ACTIVITIES.filter(a => a.category === cat) }))
    .filter(g => g.activities.length > 0);

  return (
    <div className="space-y-4">
      {grouped.map(({ category, label, activities }) => (
        <div key={category}>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">{label}</p>
          <div className="border border-gray-100 rounded-lg bg-white divide-y divide-gray-50">
            {activities.map(a => {
              const done = completedIds.includes(a.id);
              return (
                <div key={a.id} className={`flex items-center justify-between px-3 py-2 ${done ? 'opacity-40' : ''}`}>
                  <p className="text-sm text-gray-800 truncate flex-1 mr-3">{a.label}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${EFFORT_STYLE[a.effort]}`}>{EFFORT_LABEL[a.effort]}</span>
                    <span className="text-sm font-semibold text-[#4F8F73] w-[56px] text-right">+{a.points}</span>
                    {a.category !== 'streak_bonus' && (
                      <button disabled={done} onClick={() => onEarn(a.id)} className="text-[11px] px-2.5 py-1 bg-[#4F8F73] text-white rounded-md font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#3d7259] transition-colors">
                        {done ? '✓' : 'Earn'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Rewards Catalog ──

const TIER_BADGE: Record<string, string> = {
  Entry: 'bg-emerald-50 text-emerald-800',
  Silver: 'bg-gray-100 text-gray-600',
  Gold: 'bg-yellow-50 text-yellow-800',
  Platinum: 'bg-purple-50 text-purple-800',
};

function RewardsCatalog({ currentTier }: { currentTier: TierName }) {
  const byTier = TIERS.map(tier => ({
    tier,
    rewards: REWARDS.filter(r => r.requiredTier === tier.name),
  })).filter(g => g.rewards.length > 0);

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">Current tier: <span className="font-medium text-[#4F8F73]">{currentTier}</span></p>
      {byTier.map(({ tier, rewards }) => (
        <div key={tier.name}>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-3">{tier.name} tier ({tier.minPts}+ pts)</p>
          <div className="grid grid-cols-2 gap-3">
            {rewards.map(reward => {
              const unlocked = isRewardUnlocked(reward, currentTier);
              return (
                <div key={reward.id} className={`relative border rounded-xl p-4 bg-white transition-opacity ${unlocked ? 'border-gray-100' : 'border-gray-100 opacity-50'}`}>
                  <span className={`absolute -top-2 right-3 text-[11px] font-medium px-2.5 py-0.5 rounded-full ${unlocked ? 'bg-[#4F8F73] text-white' : TIER_BADGE[tier.name]}`}>
                    {unlocked ? 'Unlocked' : `${tier.minPts} pts`}
                  </span>
                  <div className="text-2xl mb-2 mt-1">{reward.icon}</div>
                  <div className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded mb-2 ${TIER_BADGE[tier.name]}`}>{tier.name}</div>
                  <p className="text-sm font-medium mb-1">{reward.title}</p>
                  <p className="text-xs text-gray-500">{reward.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Tiers View ──

function TiersView({ currentPoints }: { currentPoints: number }) {
  const [simVal, setSimVal] = useState(currentPoints);
  const simTier = getTier(simVal);
  const simNext = getNextTier(simTier.name as TierName);

  const rows = [
    { name: 'Entry', range: '0 – 75', benefit: 'Dashboard + rebate guidance', style: 'bg-emerald-50 text-emerald-800' },
    { name: 'Silver', range: '76 – 299', benefit: 'Priority support, 5% off accessories', style: 'bg-gray-100 text-gray-600' },
    { name: 'Gold', range: '300 – 799', benefit: 'Extended warranty, free filter delivery', style: 'bg-yellow-50 text-yellow-800' },
    { name: 'Platinum', range: '800+', benefit: 'VIP dispatch, 2× referral bonus', style: 'bg-purple-50 text-purple-800' },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">Like airline miles — the longer you stay active, the more you unlock. Tiers are maintained on a rolling 12-month basis.</p>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Tier</th>
            <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Points</th>
            <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Key Benefit</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.name} className="border-b border-gray-50">
              <td className="py-3 px-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${row.style}`}>{row.name}</span>
              </td>
              <td className="py-3 px-2 text-xs text-gray-500">{row.range}</td>
              <td className="py-3 px-2 text-sm">{row.benefit}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border border-gray-100 rounded-xl p-5 bg-white">
        <p className="text-sm font-medium mb-4">Simulate your tier</p>
        <div className="flex items-center gap-4 mb-3">
          <input type="range" min={0} max={1200} step={5} value={simVal} onChange={e => setSimVal(+e.target.value)}
            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #4F8F73 ${(simVal / 1200) * 100}%, #e5e7eb ${(simVal / 1200) * 100}%)` }} />
          <span className="text-sm font-medium min-w-[60px] text-right">{simVal} pts</span>
        </div>
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${simTier.bgColor} ${simTier.textColor}`}>
          {simTier.name} tier{simNext ? ` — ${simNext.minPts - simVal} pts to ${simNext.name}` : ' — top tier!'}
        </div>
      </div>
    </div>
  );
}

// ── Activity Log ──

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function ActivityLog({ entries, totalPoints }: { entries: ActivityEntry[]; totalPoints: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">Full point history</p>
        <p className="text-sm font-medium">Total: {totalPoints.toLocaleString()} pts</p>
      </div>
      <div className="border border-gray-100 rounded-xl bg-white divide-y divide-gray-50">
        {entries.map(entry => {
          const activity = POINT_ACTIVITIES.find(a => a.id === entry.activityId);
          return (
            <div key={entry.id} className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-lg bg-[#e8f5ee] flex items-center justify-center text-sm flex-shrink-0">{activity?.icon ?? '✓'}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{entry.label}</p>
                <p className="text-xs text-gray-500">{formatDate(entry.timestamp)}</p>
              </div>
              <span className="text-sm font-medium text-[#4F8F73] flex-shrink-0">+{entry.points} pts</span>
            </div>
          );
        })}
        {entries.length === 0 && (
          <div className="py-8 text-center text-sm text-gray-400">No activity yet. Complete your first task!</div>
        )}
      </div>
    </div>
  );
}
