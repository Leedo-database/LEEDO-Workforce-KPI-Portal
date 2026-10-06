import { KPIItem, MonthlyEmployeeKPI, StrategicPillar } from '../types/kpi';
import { getJDTemplateForDesignation } from '../data/jobDescriptions';

export interface ScoreCalculationResult {
  items: KPIItem[];
  finalScore: number;
  ratingLabel: 'Outstanding Performer' | 'Exceeds Expectations' | 'Meets Expectations' | 'Needs Improvement' | 'Unsatisfactory';
  ratingColor: string;
  automatedRecommendations: string[];
}

export function calculateKPIScores(
  items: Omit<KPIItem, 'achievementRate' | 'weightedScore'>[],
  designation: string
): ScoreCalculationResult {
  const templates = getJDTemplateForDesignation(designation);

  const calculatedItems: KPIItem[] = items.map((item) => {
    const target = item.target > 0 ? item.target : 1;
    const rawRate = (item.achieved / target) * 100;
    // Cap at 120% for weighted score calculation to reward high effort while preventing extreme distortion
    const cappedRateForScore = Math.min(rawRate, 120);
    const weightedScore = (item.weight * cappedRateForScore) / 100;

    return {
      ...item,
      achievementRate: Math.round(rawRate * 10) / 10,
      weightedScore: Math.round(weightedScore * 10) / 10,
    };
  });

  const rawTotal = calculatedItems.reduce((acc, curr) => acc + curr.weightedScore, 0);
  const finalScore = Math.round(rawTotal * 10) / 10;

  let ratingLabel: ScoreCalculationResult['ratingLabel'] = 'Meets Expectations';
  let ratingColor = '#d97706';

  if (finalScore >= 90) {
    ratingLabel = 'Outstanding Performer';
    ratingColor = '#15803d'; // Emerald green
  } else if (finalScore >= 80) {
    ratingLabel = 'Exceeds Expectations';
    ratingColor = '#0284c7'; // Sky blue
  } else if (finalScore >= 70) {
    ratingLabel = 'Meets Expectations';
    ratingColor = '#d97706'; // Amber
  } else if (finalScore >= 50) {
    ratingLabel = 'Needs Improvement';
    ratingColor = '#ea580c'; // Orange
  } else {
    ratingLabel = 'Unsatisfactory';
    ratingColor = '#dc2626'; // Red
  }

  // Generate Automated Recommendations based on JD rules and performance
  const recommendations: string[] = [];

  calculatedItems.forEach((item) => {
    const template = templates.find((t) => t.id === item.taskId || t.title === item.title);
    if (!template) return;

    if (item.achievementRate < template.underperformingThreshold) {
      recommendations.push(
        `[Improvement Plan - ${item.title}]: Achievement was ${item.achievementRate}% (Below target ${template.underperformingThreshold}% threshold). Recommendation: ${template.underperformingRecommendation}`
      );
    } else if (item.achievementRate >= 100) {
      recommendations.push(
        `[Merit Recognition - ${item.title}]: Target achieved at ${item.achievementRate}%. Commendation: ${template.excellenceRecommendation}`
      );
    }
  });

  if (finalScore < 60) {
    recommendations.unshift(
      '⚠️ Urgent Action: Overall monthly KPI score is below 60%. Line manager and HR must conduct an immediate one-on-one review session within 5 working days.'
    );
  } else if (finalScore >= 95) {
    recommendations.unshift(
      '🌟 Top Tier Performer: Overall score exceeds 95%. Recommended for LEEDO Annual Excellence Award and role mentoring assignment.'
    );
  }

  return {
    items: calculatedItems,
    finalScore,
    ratingLabel,
    ratingColor,
    automatedRecommendations: recommendations,
  };
}

export interface StrategicPillarBreakdown {
  pillar: StrategicPillar;
  totalWeight: number;
  weightedScoreAchieved: number;
  averageAchievementRate: number;
  taskCount: number;
}

export function getStrategicPillarsSummary(kpi: MonthlyEmployeeKPI): StrategicPillarBreakdown[] {
  const map = new Map<StrategicPillar, { weight: number; score: number; rateSum: number; count: number }>();

  kpi.items.forEach((item) => {
    const current = map.get(item.strategicPillar) || { weight: 0, score: 0, rateSum: 0, count: 0 };
    current.weight += item.weight;
    current.score += item.weightedScore;
    current.rateSum += item.achievementRate;
    current.count += 1;
    map.set(item.strategicPillar, current);
  });

  const result: StrategicPillarBreakdown[] = [];
  map.forEach((val, pillar) => {
    result.push({
      pillar,
      totalWeight: val.weight,
      weightedScoreAchieved: Math.round(val.score * 10) / 10,
      averageAchievementRate: Math.round((val.rateSum / (val.count || 1)) * 10) / 10,
      taskCount: val.count,
    });
  });

  return result.sort((a, b) => b.totalWeight - a.totalWeight);
}
