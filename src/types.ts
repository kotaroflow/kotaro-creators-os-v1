export enum CreatorFragment {
  MATHEUS = 'MATHEUS',
  KOTARO = 'KOTARO',
  MOMONGA = 'MOMONGA'
}

export enum NazarickRole {
  MOMONGA = "Momonga - Criador Supremo",
  ALBEDO = "Albedo - Supervisora dos Guardioes",
  DEMIURGE = "Demiurge - Guardiao do 7o Andar",
  COCYTUS = "Cocytus - Guardiao da Execucao",
  PANDORAS_ACTOR = "Pandora's Actor - Guardiao da Tesouraria",
  VICTIM = "Victim - Guardiao de Contencao",
  GARGANTUA = "Gargantua - Guardiao do 4o Andar",
  SEBAS_TIAN = "Sebas Tian - Mordomo-Chefe",
  SHALLTEAR = "Shalltear Bloodfallen - Guardia do 1o ao 3o Andar",
  AURA = "Aura Bella Fiora - Guardia do 6o Andar",
  MARE = "Mare Bello Fiore - Guardiao do 6o Andar",
  PESTONYA = "Pestonya - Empregada-Chefe",
  PLEIADES = "Pleiades - Esquadrao de Batalha",
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
  displayName?: string;
  isRealUser?: false;
  origin?: "simulation";
  type?: "simulation_only";
}

export interface SimulationState {
  isActive: boolean;
  marioneteNazarick: MarioneteDeNazarick | null;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  role: NazarickRole;
  xp: number;
  level: number;
  levelLimitBreak?: boolean;
  rank: string;
  karma: number;
  operationalMode: OperationalMode;
  createdAt: string;
  tags?: string[];
  managedProfileIds?: string[];
}

export type ProfileAccessLevel = "Owner" | "Admin" | "Editor" | "Viewer";

export interface Profile {
  id: string;
  name: string;
  niche: string;
  objective: string;
  socialAccounts: Record<string, string>;
  ownerId: string;
  memberIds?: string[];
  managerIds?: string[];
  editorIds?: string[];
  viewerIds?: string[];
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
