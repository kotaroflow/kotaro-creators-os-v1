export type StorageBackendId =
  | "firebase-storage"
  | "supabase-storage"
  | "cloudflare-r2"
  | "backblaze-b2"
  | "wasabi"
  | "minio"
  | "google-drive-archive";

export type StorageUseCase =
  | "profile_assets"
  | "generated_images"
  | "generated_videos"
  | "generated_audio"
  | "raw_uploads"
  | "exports"
  | "cold_archive"
  | "training_dataset";

export interface StorageBackend {
  id: StorageBackendId;
  name: string;
  status: "current" | "recommended" | "candidate" | "archive";
  useCases: StorageUseCase[];
  strengths: string[];
  risks: string[];
  costProfile: "free_start" | "low_storage" | "no_egress" | "predictable" | "self_hosted" | "subscription";
  sourceUrl: string;
}

export const storageBackends: StorageBackend[] = [
  {
    id: "firebase-storage",
    name: "Firebase Storage",
    status: "current",
    useCases: ["profile_assets", "raw_uploads"],
    strengths: ["integrado ao Firebase Auth", "simples para comecar", "bom para arquivos pequenos do app"],
    risks: ["nao e o melhor custo para biblioteca grande de video/audio", "lock-in com Google Cloud"],
    costProfile: "free_start",
    sourceUrl: "https://firebase.google.com/pricing",
  },
  {
    id: "supabase-storage",
    name: "Supabase Storage",
    status: "candidate",
    useCases: ["profile_assets", "generated_images", "exports"],
    strengths: ["integra com Supabase Auth/Postgres", "bom para assets do app", "politicas por usuario"],
    risks: ["nao deve virar deposito unico de videos pesados", "custos crescem com uso real"],
    costProfile: "predictable",
    sourceUrl: "https://supabase.com/pricing",
  },
  {
    id: "cloudflare-r2",
    name: "Cloudflare R2",
    status: "recommended",
    useCases: ["generated_images", "generated_videos", "generated_audio", "raw_uploads", "exports", "training_dataset"],
    strengths: ["S3 compativel", "sem taxa de egress", "bom para servir midia e multi-cloud"],
    risks: ["operacoes ainda cobram", "precisa configurar acesso assinado e lifecycle"],
    costProfile: "no_egress",
    sourceUrl: "https://developers.cloudflare.com/r2/pricing/",
  },
  {
    id: "backblaze-b2",
    name: "Backblaze B2",
    status: "recommended",
    useCases: ["cold_archive", "exports", "training_dataset", "generated_videos"],
    strengths: ["storage barato", "S3 compativel", "bom para backup e arquivo frio"],
    risks: ["egress e preco mudam conforme politica atual", "latencia pode variar por regiao"],
    costProfile: "low_storage",
    sourceUrl: "https://www.backblaze.com/cloud-storage/pricing",
  },
  {
    id: "wasabi",
    name: "Wasabi",
    status: "candidate",
    useCases: ["generated_videos", "cold_archive", "training_dataset"],
    strengths: ["preco previsivel por TB", "S3 compativel", "bom para midia grande"],
    risks: ["minimos/regras de retencao precisam ser conferidos", "menos flexivel que pay-per-GB fino"],
    costProfile: "predictable",
    sourceUrl: "https://wasabi.com/pricing",
  },
  {
    id: "minio",
    name: "MinIO self-hosted",
    status: "candidate",
    useCases: ["raw_uploads", "training_dataset", "cold_archive"],
    strengths: ["S3 local", "controle total", "pode rodar em servidor proprio"],
    risks: ["backup, redundancia e seguranca ficam por sua conta", "nao e custo zero se precisar alta disponibilidade"],
    costProfile: "self_hosted",
    sourceUrl: "https://min.io/",
  },
  {
    id: "google-drive-archive",
    name: "Google Drive Archive",
    status: "archive",
    useCases: ["exports", "cold_archive"],
    strengths: ["aproveita seu armazenamento atual", "bom para backup manual/arquivo pessoal"],
    risks: ["nao e object storage de app", "automacao/API pode ser limitada por quotas e organizacao"],
    costProfile: "subscription",
    sourceUrl: "https://one.google.com/about/plans",
  },
];

const recommendedByUseCase: Record<StorageUseCase, StorageBackendId[]> = {
  profile_assets: ["supabase-storage", "firebase-storage", "cloudflare-r2"],
  generated_images: ["cloudflare-r2", "supabase-storage", "backblaze-b2"],
  generated_videos: ["cloudflare-r2", "backblaze-b2", "wasabi"],
  generated_audio: ["cloudflare-r2", "backblaze-b2", "supabase-storage"],
  raw_uploads: ["cloudflare-r2", "firebase-storage", "minio"],
  exports: ["cloudflare-r2", "backblaze-b2", "google-drive-archive"],
  cold_archive: ["backblaze-b2", "wasabi", "google-drive-archive"],
  training_dataset: ["cloudflare-r2", "backblaze-b2", "minio"],
};

export const recommendStorageBackends = (useCase: StorageUseCase) =>
  recommendedByUseCase[useCase]
    .map((id) => storageBackends.find((backend) => backend.id === id))
    .filter((backend): backend is StorageBackend => Boolean(backend));
