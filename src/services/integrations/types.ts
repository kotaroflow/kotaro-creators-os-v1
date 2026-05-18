export type PlatformConnectorId =
  | "youtube"
  | "instagram"
  | "tiktok"
  | "google-analytics"
  | "search-console"
  | "meta-ads"
  | "tiktok-ads"
  | "affiliate-network"
  | "manual-csv";

export type ConnectorAuthMethod =
  | "oauth"
  | "api_key"
  | "service_account"
  | "csv_import"
  | "manual";

export type DataTruthLevel =
  | "official_api"
  | "official_export"
  | "platform_report"
  | "manual_entry"
  | "untrusted";

export type PlatformMetric =
  | "views"
  | "watch_time"
  | "likes"
  | "comments"
  | "shares"
  | "followers"
  | "clicks"
  | "impressions"
  | "reach"
  | "ctr"
  | "conversions"
  | "revenue"
  | "spend"
  | "rpm"
  | "engagement_rate";

export interface PlatformConnectorDescriptor {
  id: PlatformConnectorId;
  name: string;
  status: "planned" | "manual_first" | "ready_later";
  authMethods: ConnectorAuthMethod[];
  truthLevel: DataTruthLevel;
  sourceUrl: string;
  metrics: PlatformMetric[];
  syncCadence: "hourly" | "daily" | "weekly" | "manual";
  setupNotes: string[];
  risks: string[];
}

export interface PlatformMetricSnapshot {
  id: string;
  connectorId: PlatformConnectorId;
  profileId: string;
  externalAccountId?: string;
  externalContentId?: string;
  capturedAt: string;
  periodStart: string;
  periodEnd: string;
  metrics: Partial<Record<PlatformMetric, number>>;
  truthLevel: DataTruthLevel;
  sourceUrl?: string;
  rawPayloadRef?: string;
}

export interface IngestionJob {
  id: string;
  connectorId: PlatformConnectorId;
  profileId: string;
  status: "queued" | "running" | "succeeded" | "failed" | "needs_auth";
  scheduledFor: string;
  startedAt?: string;
  finishedAt?: string;
  errorMessage?: string;
  importedSnapshots: number;
}
