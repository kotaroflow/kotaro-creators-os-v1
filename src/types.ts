export enum CreatorFragment {
  MATHEUS = 'MATHEUS',
  KOTARO = 'KOTARO',
  MOMONGA = 'MOMONGA'
}

export enum NazarickRole {
  MOMONGA = "Momonga — Criador Supremo",
  ALBEDO = "Albedo — Supervisora dos Guardiões",
  DEMIURGE = "Demiurge — Guardião do 7º Andar",
  COCYTUS = "Cocytus — Guardião da Execução",
  PANDORAS_ACTOR = "Pandora’s Actor — Guardião da Tesouraria",
  VICTIM = "Victim — Guardião de Contenção",
  GARGANTUA = "Gargantua — Guardião do 4º Andar",
  SEBAS_TIAN = "Sebas Tian — Mordomo-Chefe",
  SHALLTEAR = "Shalltear Bloodfallen — Guardiã do 1º ao 3º Andar",
  AURA = "Aura Bella Fiora — Guardiã do 6º Andar",
  MARE = "Mare Bello Fiore — Guardião do 6º Andar",
  PESTONYA = "Pestonya — Empregada-Chefe",
  PLEIADES = "Pleiades — Esquadrão de Batalha",
}

export enum OperationalMode {
  EASY = "Easy",
  NORMAL = "Normal",
  HARD = "Hard",
  SUPREME = "Ser Supremo",
}

export const getEffectiveRank = (user: User | null | undefined): string => {
  if (!user) return 'F';
  const rawRank = (user.rank || 'F').trim();
  if (user.role !== NazarickRole.MOMONGA) return rawRank;
  
  // Simulation logic for Supreme beings
  switch(user.operationalMode) {
    case OperationalMode.EASY: return 'F';
    case OperationalMode.NORMAL: return 'C';
    case OperationalMode.HARD: return 'A';
    case OperationalMode.SUPREME: return rawRank === 'F' ? 'SSS' : rawRank;
    default: return rawRank;
  }
};

export interface MarioneteDeNazarick extends Partial<User> {
  id?: string;
  isRealUser?: false;
  origin?: "simulation";
  type?: "simulation_only";
}

export interface SimulationState {
  isActive: boolean;
  marioneteNazarick: MarioneteDeNazarick | null;
  simulatedFragment: CreatorFragment;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  role: NazarickRole;
  xp: number;
  level: number;
  levelLimitBreak?: boolean; // Se true, o usuário pode passar do level 999
  rank: string;
  karma: number;
  operationalMode: OperationalMode;
  createdAt: string;
  tags?: string[];
}

export interface Profile {
  id: string;
  name: string;
  niche: string;
  objective: string;
  socialAccounts: Record<string, string>;
  ownerId: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  status: "Pending" | "In_Progress" | "Completed" | "Failed";
  deadline?: string;
}

export interface Content {
  id: string;
  title: string;
  type: "Video" | "Post" | "Story" | "Audio";
  status: "Draft" | "Review" | "Approved" | "Scheduled" | "Published";
  script?: string;
  aiPrompt?: string;
}
