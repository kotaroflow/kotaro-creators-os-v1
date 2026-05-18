import { aiModelRegistry, aiProviderRegistry } from "./providerRegistry";
import type {
  AiRouteCandidate,
  AiRoutingDecision,
  AiRoutingPolicy,
  AiRoutingRequest,
  CostEstimate,
  CostTier,
  LatencyTier,
  QualityTier,
} from "./types";

const qualityRank: Record<QualityTier, number> = {
  draft: 1,
  standard: 2,
  premium: 3,
  specialist: 4,
};

const costRank: Record<CostTier, number> = {
  free_local: 0,
  low: 1,
  medium: 2,
  high: 3,
  premium: 4,
};

const latencyRank: Record<LatencyTier, number> = {
  instant: 4,
  fast: 3,
  normal: 2,
  slow: 1,
};

const estimateCost = (costTier: CostTier, request: AiRoutingRequest): CostEstimate => {
  const sizeMultiplier =
    (request.promptSize === "large" ? 2 : request.promptSize === "medium" ? 1.25 : 1) *
    (request.outputSize === "large" ? 2 : request.outputSize === "medium" ? 1.25 : 1);

  const baseByTier: Record<CostTier, [number, number]> = {
    free_local: [0, 0],
    low: [0.001, 0.03],
    medium: [0.03, 0.4],
    high: [0.4, 2.5],
    premium: [2.5, 25],
  };

  const [minUsd, maxUsd] = baseByTier[costTier];

  return {
    minUsd: Number((minUsd * sizeMultiplier).toFixed(4)),
    maxUsd: Number((maxUsd * sizeMultiplier).toFixed(4)),
    confidence: costTier === "free_local" ? "estimated" : "unknown",
    basis: "Tier estimate until live provider pricing is connected to the ledger.",
  };
};

const scoreCandidate = (
  candidate: AiRouteCandidate,
  policy: AiRoutingPolicy
): AiRouteCandidate => {
  let score = 0;
  const reasons: string[] = [];
  const model = candidate.model;

  const targetQuality = policy.qualityTarget ? qualityRank[policy.qualityTarget] : 2;
  const modelQuality = qualityRank[model.qualityTier];
  score += modelQuality * 18;

  if (modelQuality >= targetQuality) {
    score += 12;
    reasons.push("atinge o nivel de qualidade solicitado");
  }

  const costPressure = policy.costSensitivity === "strict" ? 14 : policy.costSensitivity === "balanced" ? 9 : 4;
  score -= costRank[model.costTier] * costPressure;

  if (model.costTier === "free_local" || model.costTier === "low") {
    reasons.push("bom candidato para economizar creditos");
  }

  const speedTarget = policy.speedTarget ? latencyRank[policy.speedTarget] : 2;
  score += latencyRank[model.latencyTier] * 4;

  if (latencyRank[model.latencyTier] >= speedTarget) {
    score += 8;
    reasons.push("atende a meta de velocidade");
  }

  if (policy.preferredProviders?.includes(model.providerId)) {
    score += 16;
    reasons.push("provedor preferido para esta politica");
  }

  if (policy.requireCommercialSafety && model.rightsProfile === "commercial_safe") {
    score += 10;
    reasons.push("perfil comercial mais seguro");
  }

  if (model.status === "experimental") {
    score -= policy.allowExperimental ? 4 : 30;
    reasons.push("experimental, exige revisao antes de producao");
  }

  return { ...candidate, score, reasons: [...candidate.reasons, ...reasons] };
};

export const routeAiTask = (request: AiRoutingRequest): AiRoutingDecision => {
  const policy = request.policy ?? {};
  const warnings: string[] = [];
  const rejected: AiRouteCandidate[] = [];

  const candidates = aiModelRegistry.flatMap((model) => {
    const provider = aiProviderRegistry.find((item) => item.id === model.providerId);
    if (!provider) return [];

    const estimate = estimateCost(model.costTier, request);
    const baseCandidate: AiRouteCandidate = {
      model,
      provider,
      score: 0,
      estimate,
      reasons: [],
    };

    if (!model.modalities.includes(request.modality)) {
      return [];
    }

    if (!model.taskTypes.includes(request.taskType)) {
      return [];
    }

    if (policy.blockedProviders?.includes(model.providerId)) {
      rejected.push({ ...baseCandidate, reasons: ["provedor bloqueado pela politica"] });
      return [];
    }

    if (!policy.allowExperimental && model.status === "experimental") {
      rejected.push({ ...baseCandidate, reasons: ["modelo experimental bloqueado"] });
      return [];
    }

    if (policy.requireCommercialSafety && model.rightsProfile !== "commercial_safe") {
      rejected.push({ ...baseCandidate, reasons: ["exige revisao de direitos/licenca"] });
      return [];
    }

    if (typeof policy.maxEstimatedUsd === "number" && estimate.maxUsd > policy.maxEstimatedUsd) {
      rejected.push({ ...baseCandidate, reasons: ["estimativa acima do teto configurado"] });
      return [];
    }

    return scoreCandidate(baseCandidate, policy);
  });

  const ranked = candidates.sort((a, b) => b.score - a.score);

  if (!ranked.length) {
    warnings.push("Nenhum modelo atende a politica atual. Afrouxe custo, seguranca comercial ou modelos experimentais.");
  }

  if (request.modality === "video" && !policy.maxEstimatedUsd) {
    warnings.push("Geracao de video deve sempre informar maxEstimatedUsd antes de rodar em producao.");
  }

  return {
    request,
    primary: ranked[0] ?? null,
    fallbacks: ranked.slice(1, 4),
    rejected,
    warnings,
  };
};

export const shouldEscalateToPremium = (decision: AiRoutingDecision) => {
  const primary = decision.primary;
  if (!primary) return false;

  return primary.model.qualityTier === "draft" || primary.model.costTier === "free_local";
};
