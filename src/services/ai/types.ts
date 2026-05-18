export type AiProviderId =
  | "google-gemini"
  | "google-veo"
  | "openai"
  | "anthropic"
  | "runway"
  | "elevenlabs"
  | "deepgram"
  | "replicate"
  | "fal"
  | "openrouter"
  | "together"
  | "mistral"
  | "groq"
  | "local";

export type AiModality =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "speech_to_text"
  | "music"
  | "embedding"
  | "vision"
  | "agent"
  | "safety";

export type AiTaskType =
  | "idea_generation"
  | "strategy"
  | "scriptwriting"
  | "copywriting"
  | "analysis"
  | "image_generation"
  | "image_editing"
  | "video_generation"
  | "video_editing"
  | "voiceover"
  | "speech_to_text"
  | "music_generation"
  | "copyright_review"
  | "quality_review"
  | "platform_data_analysis"
  | "automation_agent"
  | "embedding"
  | "translation";

export type QualityTier = "draft" | "standard" | "premium" | "specialist";
export type CostTier = "free_local" | "low" | "medium" | "high" | "premium";
export type LatencyTier = "instant" | "fast" | "normal" | "slow";
export type ProviderStatus = "ready" | "planned" | "experimental" | "manual";
export type RightsProfile = "commercial_safe" | "review_required" | "private_only" | "unknown";

export interface AiProviderDescriptor {
  id: AiProviderId;
  name: string;
  status: ProviderStatus;
  website: string;
  envKeys: string[];
  modalities: AiModality[];
  strengths: string[];
  costNotes: string;
  rightsProfile: RightsProfile;
  setupNotes: string;
}

export interface AiModelDescriptor {
  id: string;
  providerId: AiProviderId;
  displayName: string;
  status: ProviderStatus;
  modalities: AiModality[];
  taskTypes: AiTaskType[];
  qualityTier: QualityTier;
  costTier: CostTier;
  latencyTier: LatencyTier;
  rightsProfile: RightsProfile;
  strengths: string[];
  limits: string[];
  notes?: string;
}

export interface AiRoutingPolicy {
  qualityTarget?: QualityTier;
  costSensitivity?: "low" | "balanced" | "strict";
  speedTarget?: LatencyTier;
  allowExperimental?: boolean;
  requireCommercialSafety?: boolean;
  preferredProviders?: AiProviderId[];
  blockedProviders?: AiProviderId[];
  maxEstimatedUsd?: number;
}

export interface AiRoutingRequest {
  taskType: AiTaskType;
  modality: AiModality;
  promptSize?: "small" | "medium" | "large";
  outputSize?: "small" | "medium" | "large";
  policy?: AiRoutingPolicy;
  tags?: string[];
}

export interface CostEstimate {
  minUsd: number;
  maxUsd: number;
  confidence: "exact" | "estimated" | "unknown";
  basis: string;
}

export interface AiRouteCandidate {
  model: AiModelDescriptor;
  provider: AiProviderDescriptor;
  score: number;
  estimate: CostEstimate;
  reasons: string[];
}

export interface AiRoutingDecision {
  request: AiRoutingRequest;
  primary: AiRouteCandidate | null;
  fallbacks: AiRouteCandidate[];
  rejected: AiRouteCandidate[];
  warnings: string[];
}

export interface AiUsageRecord {
  id: string;
  providerId: AiProviderId;
  modelId: string;
  taskType: AiTaskType;
  modality: AiModality;
  createdAt: string;
  profileId?: string;
  projectId?: string;
  inputUnits?: number;
  outputUnits?: number;
  estimatedUsd: number;
  actualUsd?: number;
  status: "planned" | "running" | "succeeded" | "failed" | "cancelled";
  notes?: string;
}
