export type BackendProviderId =
  | "firebase"
  | "supabase"
  | "appwrite"
  | "pocketbase"
  | "directus"
  | "custom-postgres";

export type BackendCapability =
  | "auth"
  | "database"
  | "realtime"
  | "storage"
  | "functions"
  | "admin_panel"
  | "self_hosting"
  | "row_level_security";

export interface BackendOption {
  id: BackendProviderId;
  name: string;
  status: "current" | "recommended" | "candidate" | "future";
  capabilities: BackendCapability[];
  bestFor: string[];
  tradeoffs: string[];
  migrationFit: "stay" | "gradual_exit" | "fast_exit" | "specialized";
  costProfile: "free_start" | "predictable" | "usage_based" | "self_hosted";
  sourceUrl: string;
}

export const backendOptions: BackendOption[] = [
  {
    id: "firebase",
    name: "Firebase",
    status: "current",
    capabilities: ["auth", "database", "realtime", "storage", "functions"],
    bestFor: ["prototipo rapido", "dados legados", "sincronizacao simples", "ecossistema Google"],
    tradeoffs: [
      "custo pode crescer com leitura/escrita/storage",
      "menos portavel que Postgres",
      "regras precisam ser muito bem testadas",
    ],
    migrationFit: "stay",
    costProfile: "usage_based",
    sourceUrl: "https://firebase.google.com/pricing",
  },
  {
    id: "supabase",
    name: "Supabase",
    status: "recommended",
    capabilities: ["auth", "database", "realtime", "storage", "functions", "row_level_security"],
    bestFor: ["Postgres", "auth mais portavel", "dados relacionais", "dashboards", "migracao gradual do Firebase"],
    tradeoffs: [
      "storage nao deve ser o unico lugar para midia pesada",
      "precisa desenhar RLS com cuidado",
      "projeto grande ainda exige monitoramento",
    ],
    migrationFit: "gradual_exit",
    costProfile: "predictable",
    sourceUrl: "https://supabase.com/pricing",
  },
  {
    id: "appwrite",
    name: "Appwrite",
    status: "candidate",
    capabilities: ["auth", "database", "storage", "functions", "self_hosting"],
    bestFor: ["backend open-source completo", "self-host opcional", "apps privados"],
    tradeoffs: ["menos Postgres-native", "ecossistema menor que Firebase/Supabase"],
    migrationFit: "specialized",
    costProfile: "free_start",
    sourceUrl: "https://appwrite.io/pricing",
  },
  {
    id: "pocketbase",
    name: "PocketBase",
    status: "future",
    capabilities: ["auth", "database", "realtime", "storage", "admin_panel", "self_hosting"],
    bestFor: ["uso privado pequeno", "prototipos offline", "baixo custo em VPS"],
    tradeoffs: [
      "SQLite e single-binary pedem cuidado para escala",
      "backup e alta disponibilidade ficam por sua conta",
    ],
    migrationFit: "specialized",
    costProfile: "self_hosted",
    sourceUrl: "https://pocketbase.io/docs/going-to-production/",
  },
  {
    id: "directus",
    name: "Directus",
    status: "future",
    capabilities: ["database", "admin_panel", "functions", "self_hosting"],
    bestFor: ["admin/CMS sobre SQL", "operacao editorial", "painel de dados"],
    tradeoffs: ["licenca/preco precisam ser conferidos antes de producao", "nao substitui sozinho auth/app logic"],
    migrationFit: "specialized",
    costProfile: "self_hosted",
    sourceUrl: "https://directus.io/pricing/",
  },
  {
    id: "custom-postgres",
    name: "Postgres custom + Auth.js/Keycloak",
    status: "future",
    capabilities: ["auth", "database", "functions", "self_hosting", "row_level_security"],
    bestFor: ["controle maximo", "independencia de fornecedor", "custos previsiveis em VPS"],
    tradeoffs: [
      "mais manutencao",
      "seguranca, backups e observabilidade precisam ser implementados",
      "nao e ideal para agora sem ganhar maturidade antes",
    ],
    migrationFit: "fast_exit",
    costProfile: "self_hosted",
    sourceUrl: "https://www.postgresql.org/",
  },
];

export const recommendedBackendPath = [
  {
    phase: "agora",
    action: "manter Firebase funcionando, mas isolar dependencias em services",
  },
  {
    phase: "proxima",
    action: "criar Supabase/Postgres para usuarios, perfis, jobs, ledger de IA e metricas",
  },
  {
    phase: "midia pesada",
    action: "guardar videos, imagens e audios em object storage separado, nao no banco principal",
  },
  {
    phase: "saida final",
    action: "migrar auth/dados do Firebase quando o Supabase estiver validado com backup e RLS",
  },
];

export const getBackendOption = (id: BackendProviderId) =>
  backendOptions.find((option) => option.id === id);
