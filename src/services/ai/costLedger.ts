import type { AiProviderId, AiTaskType, AiUsageRecord } from "./types";

export interface AiBudget {
  dailyUsd: number;
  monthlyUsd: number;
  hardStopUsd: number;
}

export interface AiSpendSummary {
  totalEstimatedUsd: number;
  totalActualUsd: number;
  byProvider: Partial<Record<AiProviderId, number>>;
  byTaskType: Partial<Record<AiTaskType, number>>;
}

export class InMemoryAiCostLedger {
  private records: AiUsageRecord[] = [];

  list() {
    return [...this.records];
  }

  recordUsage(record: AiUsageRecord) {
    this.records = [record, ...this.records];
    return record;
  }

  summarize(records = this.records): AiSpendSummary {
    return records.reduce<AiSpendSummary>(
      (summary, record) => {
        const value = record.actualUsd ?? record.estimatedUsd;

        summary.totalEstimatedUsd += record.estimatedUsd;
        summary.totalActualUsd += value;
        summary.byProvider[record.providerId] = (summary.byProvider[record.providerId] ?? 0) + value;
        summary.byTaskType[record.taskType] = (summary.byTaskType[record.taskType] ?? 0) + value;

        return summary;
      },
      {
        totalEstimatedUsd: 0,
        totalActualUsd: 0,
        byProvider: {},
        byTaskType: {},
      }
    );
  }
}

export const defaultAiBudget: AiBudget = {
  dailyUsd: 2,
  monthlyUsd: 40,
  hardStopUsd: 55,
};

export const canRunAiJob = (
  estimatedUsd: number,
  currentMonthSpendUsd: number,
  budget: AiBudget = defaultAiBudget
) => {
  const projected = currentMonthSpendUsd + estimatedUsd;

  return {
    allowed: projected <= budget.hardStopUsd,
    projected,
    remainingBeforeHardStop: Math.max(0, budget.hardStopUsd - projected),
    warning:
      projected > budget.monthlyUsd
        ? "Acima do orcamento mensal recomendado; exigir confirmacao manual."
        : null,
  };
};

export const createAiUsageId = () =>
  `ai_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
