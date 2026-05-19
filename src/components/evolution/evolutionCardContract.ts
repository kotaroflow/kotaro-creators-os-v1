import { NazarickRole } from '../../types';

export type EvolutionCardState =
  | 'locked'
  | 'available'
  | 'current'
  | 'ascended'
  | 'limit-break'
  | 'simulation';

export interface EvolutionCardVisualSlot {
  id: string;
  purpose: 'rank' | 'character' | 'kanji' | 'xp' | 'aura' | 'badge' | 'action';
  required: boolean;
  notes: string;
}

export interface EvolutionCardVNextBlueprint {
  system: 'YGGNAROK';
  shortSeal: 'YGN';
  version: 'vNext-ready';
  states: EvolutionCardState[];
  userFields: Array<'uid' | 'name' | 'role' | 'rank' | 'level' | 'xp' | 'karma' | 'managedProfileIds'>;
  profileFields: Array<'id' | 'name' | 'niche' | 'objective' | 'ownerId'>;
  visualSlots: EvolutionCardVisualSlot[];
  reservedForRoles: NazarickRole[];
}

export const EVOLUTION_CARD_VNEXT_CONTRACT: EvolutionCardVNextBlueprint = {
  system: 'YGGNAROK',
  shortSeal: 'YGN',
  version: 'vNext-ready',
  states: ['locked', 'available', 'current', 'ascended', 'limit-break', 'simulation'],
  userFields: ['uid', 'name', 'role', 'rank', 'level', 'xp', 'karma', 'managedProfileIds'],
  profileFields: ['id', 'name', 'niche', 'objective', 'ownerId'],
  reservedForRoles: [
    NazarickRole.MOMONGA,
    NazarickRole.ALBEDO,
    NazarickRole.DEMIURGE,
    NazarickRole.PLEIADES,
    NazarickRole.PESTONYA,
  ],
  visualSlots: [
    {
      id: 'rank-seal',
      purpose: 'rank',
      required: true,
      notes: 'Selo principal do rank, preparado para trocar SVG/CSS por arte final.',
    },
    {
      id: 'kanji-concept',
      purpose: 'kanji',
      required: true,
      notes: 'Conceito curto em kanji/japones quando existir no tier.',
    },
    {
      id: 'xp-meter',
      purpose: 'xp',
      required: true,
      notes: 'Barra de XP com estado atual, proximo rank e limite.',
    },
    {
      id: 'character-theme',
      purpose: 'character',
      required: false,
      notes: 'Reservado para personagens/temas por rank quando o redesign chegar.',
    },
    {
      id: 'special-aura',
      purpose: 'aura',
      required: false,
      notes: 'Reservado para estados especiais como limit break, ascensao e simulacao.',
    },
  ],
};

export const createEvolutionCardDraftId = (rank: string, state: EvolutionCardState = 'current') =>
  `ygn-evolution-card-${rank.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${state}`;
