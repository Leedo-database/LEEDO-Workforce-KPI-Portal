import { KPIItem } from '../types/kpi';

export interface WeightAdjustmentResult {
  adjustedItems: KPIItem[];
  deductionSummary: string;
  isValid: boolean;
  error?: string;
  totalWeight: number;
}

/**
 * Adjusts KPI weights so that the total never exceeds 100%.
 * If adding or increasing a KPI's weight causes the total to exceed 100%,
 * this function automatically deducts weight from other KPIs equally / step-by-step
 * from the top-weighted KPIs, keeping each KPI at or above a minimum weight (5%).
 */
export function calculateWeightAdjustment(
  existingItems: KPIItem[],
  targetWeight: number,
  editingTaskId?: string
): WeightAdjustmentResult {
  const minWeight = 5;

  if (targetWeight <= 0) {
    return {
      adjustedItems: existingItems,
      deductionSummary: '',
      isValid: false,
      error: 'কেপিআই ওয়েট অবশ্যই ০ এর বেশি হতে হবে (সর্বনিম্ন ৫%)।',
      totalWeight: existingItems.reduce((acc, it) => acc + it.weight, 0),
    };
  }

  if (targetWeight > 100) {
    return {
      adjustedItems: existingItems,
      deductionSummary: '',
      isValid: false,
      error: 'কেপিআই ওয়েট ১০০% এর অতিরিক্ত হতে পারবে না।',
      totalWeight: 100,
    };
  }

  // Items other than the one being edited or added
  const otherItems = existingItems.filter((it) => it.taskId !== editingTaskId);

  // If this is the only item
  if (otherItems.length === 0) {
    if (targetWeight > 100) {
      return {
        adjustedItems: existingItems,
        deductionSummary: '',
        isValid: false,
        error: 'মোট ওয়েট ১০০% এর অতিরিক্ত হতে পারবে না।',
        totalWeight: targetWeight,
      };
    }
    return {
      adjustedItems: existingItems,
      deductionSummary: 'একক কেপিআই হিসেবে বরাদ্দকৃত।',
      isValid: true,
      totalWeight: targetWeight,
    };
  }

  // Current weight of other items
  const currentOthersWeight = otherItems.reduce((sum, it) => sum + it.weight, 0);

  // Target remaining weight for other items
  const maxAllowedForOthers = 100 - targetWeight;

  // Check if minimum weight condition can be met
  const minRequiredForOthers = otherItems.length * minWeight;
  if (maxAllowedForOthers < minRequiredForOthers) {
    const maxPossible = 100 - minRequiredForOthers;
    return {
      adjustedItems: existingItems,
      deductionSummary: '',
      isValid: false,
      error: `অন্যান্য ${otherItems.length}টি কেপিআই-এর সর্বনিম্ন ৫% ওয়েট বজায় রাখতে নতুন কেপিআই-এর সর্বোচ্চ ওয়েট ${Math.max(5, maxPossible)}% হতে পারে।`,
      totalWeight: currentOthersWeight + targetWeight,
    };
  }

  const deductionNeeded = currentOthersWeight - maxAllowedForOthers;

  // If no deduction needed (e.g. current sum + targetWeight <= 100)
  if (deductionNeeded <= 0) {
    const total = currentOthersWeight + targetWeight;
    return {
      adjustedItems: existingItems,
      deductionSummary: `মোট ওয়েট ${total}% (১০০% এর মধ্যে রয়েছে, অন্য কেপিআই কমানোর প্রয়োজন নেই)।`,
      isValid: true,
      totalWeight: total,
    };
  }

  // Step-by-step equal / round-robin deduction from highest-weighted KPIs
  // "onno kpi theke soman hare % kombe, jemon new kpi te 5 dilo, tahole top 5 theke 1 kore kome ekhane add hobe"
  const adjusted = otherItems.map((it) => ({ ...it, weight: it.weight }));
  let remainingDeduction = deductionNeeded;

  let iterations = 0;
  while (remainingDeduction > 0 && iterations < 1000) {
    iterations++;
    // Sort descending so the top-weighted KPIs give up 1% first
    adjusted.sort((a, b) => b.weight - a.weight);

    // Find candidate with weight > minWeight
    const candidate = adjusted.find((it) => it.weight > minWeight);
    if (!candidate) break;

    candidate.weight -= 1;
    remainingDeduction -= 1;
  }

  // Re-map back to preserve original item order
  const finalAdjustedOthers = otherItems.map((original) => {
    const match = adjusted.find((a) => a.taskId === original.taskId);
    return match ? { ...original, weight: match.weight } : original;
  });

  const modifiedList = finalAdjustedOthers.filter((item) => {
    const orig = otherItems.find((o) => o.taskId === item.taskId);
    return orig && orig.weight !== item.weight;
  });

  const summary = `অন্যান্য ${modifiedList.length}টি কেপিআই থেকে সমান হারে মোট ${deductionNeeded}% ওয়েট স্বয়ংক্রিয়ভাবে কমানো হয়েছে যাতে সর্বমোট ১০০% বজায় থাকে।`;

  return {
    adjustedItems: finalAdjustedOthers,
    deductionSummary: summary,
    isValid: true,
    totalWeight: 100,
  };
}
