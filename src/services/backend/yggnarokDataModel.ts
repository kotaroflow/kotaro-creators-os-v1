export type YgnEntityName =
  | "users"
  | "profiles"
  | "evolution_cards"
  | "xp_events"
  | "rank_rules"
  | "agent_modules"
  | "agent_logs"
  | "permissions"
  | "media_assets"
  | "ai_jobs"
  | "ai_usage_records"
  | "platform_accounts"
  | "platform_metric_snapshots";

export interface YgnEntityBlueprint {
  name: YgnEntityName;
  purpose: string;
  primaryFields: string[];
  notes: string[];
}

export const yggnarokDataModel: YgnEntityBlueprint[] = [
  {
    name: "users",
    purpose: "Membros confiaveis que acessam o YGGNAROK.",
    primaryFields: ["id", "name", "email", "role", "rank", "level", "xp", "karma", "operationalMode", "createdAt"],
    notes: ["Google Login fica desativado por enquanto.", "Auth futura deve ser isolada em backend seguro."],
  },
  {
    name: "profiles",
    purpose: "Perfis de trabalho, nichos, marcas internas e contextos de criacao.",
    primaryFields: ["id", "ownerId", "name", "niche", "objective", "socialAccounts", "createdAt"],
    notes: ["Todo conteudo, metrica e ativo deve apontar para um perfil."],
  },
  {
    name: "evolution_cards",
    purpose: "Definicao dos cards centrais do Sistema de Evolucao.",
    primaryFields: ["id", "rank", "title", "kanji", "concept", "xpRequired", "minLevel", "minKarma", "theme", "isActive"],
    notes: ["Cards sao prioridade visual atual.", "Nao confundir com agentes ou tela de ranks pura."],
  },
  {
    name: "xp_events",
    purpose: "Historico auditavel de ganho/perda de XP, karma e level.",
    primaryFields: ["id", "userId", "profileId", "sourceType", "sourceId", "xpDelta", "karmaDelta", "createdAt"],
    notes: ["Permite explicar por que um card/rank mudou."],
  },
  {
    name: "rank_rules",
    purpose: "Regras de desbloqueio de rank e estados especiais.",
    primaryFields: ["id", "rank", "conditionType", "threshold", "description", "enabled"],
    notes: ["Mantem a evolucao ajustavel sem mexer direto nos componentes."],
  },
  {
    name: "agent_modules",
    purpose: "Agentes/IAs funcionais sem visual proprio neste ciclo.",
    primaryFields: ["id", "name", "function", "context", "allowedActions", "blockedActions", "permissions", "enabled"],
    notes: ["Nao criar avatar, skin, mascote ou tela visual individual agora.", "Agentes operam por regras, contexto e permissoes."],
  },
  {
    name: "agent_logs",
    purpose: "Registro de decisoes, recomendacoes e acoes dos agentes.",
    primaryFields: ["id", "agentId", "userId", "profileId", "action", "inputRef", "outputRef", "status", "createdAt"],
    notes: ["Essencial para auditoria e para evitar loops ou gasto sem controle."],
  },
  {
    name: "permissions",
    purpose: "Permissoes por usuario, perfil, agente e acao.",
    primaryFields: ["id", "subjectType", "subjectId", "resourceType", "resourceId", "action", "effect"],
    notes: ["Base para separar iniciante, profissional, admin e simulacao."],
  },
  {
    name: "media_assets",
    purpose: "Metadados de imagens, videos, audios e exports.",
    primaryFields: ["id", "profileId", "type", "storageProvider", "storageKey", "sourceJobId", "rightsStatus", "createdAt"],
    notes: ["Arquivo grande fica em R2/B2/Storage, nao no banco principal."],
  },
  {
    name: "ai_jobs",
    purpose: "Fila de tarefas de IA com roteamento, status e checkpoints.",
    primaryFields: ["id", "profileId", "taskType", "providerId", "modelId", "status", "budgetUsd", "createdAt"],
    notes: ["Video/voz premium devem exigir confirmacao antes de rodar."],
  },
  {
    name: "ai_usage_records",
    purpose: "Ledger de custo estimado e real por chamada de IA.",
    primaryFields: ["id", "jobId", "providerId", "modelId", "estimatedUsd", "actualUsd", "status", "createdAt"],
    notes: ["Ajuda a cortar custo sem limitar o OS."],
  },
  {
    name: "platform_accounts",
    purpose: "Contas externas conectadas por API oficial/export oficial.",
    primaryFields: ["id", "profileId", "platform", "externalAccountId", "authStatus", "lastSyncAt"],
    notes: ["Coleta real deve vir de APIs oficiais, OAuth ou exports auditaveis."],
  },
  {
    name: "platform_metric_snapshots",
    purpose: "Metricas reais por conteudo, periodo e plataforma.",
    primaryFields: ["id", "profileId", "platform", "externalContentId", "periodStart", "periodEnd", "metrics", "truthLevel"],
    notes: ["Base para o YGGNAROK aprender com resultados reais de conteudo e afiliacao."],
  },
];

export const agentModuleRules = {
  visualIdentityEnabled: false,
  allowedNow: ["nome", "funcao", "regras", "permissoes", "contexto", "acoes permitidas", "acoes bloqueadas"],
  blockedNow: ["avatar", "skin", "mascote", "card visual proprio", "tela propria de agente"],
};
