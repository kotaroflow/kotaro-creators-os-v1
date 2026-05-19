import { CreatorFragment, NazarickRole } from "../../types";

export type YgnOperationalContext =
  | "real_os"
  | "fragment_focus"
  | "simulation_sandbox";

export interface YgnAgentContextGuard {
  context: YgnOperationalContext;
  allowedForRoles: NazarickRole[];
  allowedFragments?: CreatorFragment[];
  rules: string[];
  blockedActions: string[];
}

export const ygnAgentContextGuards: Record<YgnOperationalContext, YgnAgentContextGuard> = {
  real_os: {
    context: "real_os",
    allowedForRoles: Object.values(NazarickRole),
    rules: [
      "Tratar varios usuarios como padrao do OS.",
      "Sempre respeitar vinculo usuario-perfil antes de ler, sugerir ou alterar dados.",
      "Usar fragmento apenas como foco de trabalho quando a conta suprema estiver operando.",
    ],
    blockedActions: [
      "Assumir que existe apenas um usuario.",
      "Aplicar permissao de admin sem checar cargo e vinculo com perfil.",
    ],
  },
  fragment_focus: {
    context: "fragment_focus",
    allowedForRoles: [NazarickRole.MOMONGA],
    allowedFragments: [CreatorFragment.MATHEUS, CreatorFragment.KOTARO, CreatorFragment.MOMONGA],
    rules: [
      "Fragmentos pertencem a conta suprema e servem para foco operacional.",
      "MATHEUS, KOTARO e MOMONGA podem filtrar telas e prioridades reais.",
      "Fragmento nao e usuario simulado, nao e cargo e nao e permissao.",
    ],
    blockedActions: [
      "Trocar estado de simulacao ao selecionar fragmento.",
      "Usar fragmento para gravar mudanca de cargo, rank, XP ou perfil.",
    ],
  },
  simulation_sandbox: {
    context: "simulation_sandbox",
    allowedForRoles: [NazarickRole.MOMONGA],
    rules: [
      "Simulacao so acontece na conta suprema.",
      "Simulacao testa usuario, cargo, rank, XP, karma, modo operacional e vinculos com perfis.",
      "Simulacao deve rodar em espaco isolado, sem MATHEUS, KOTARO ou MOMONGA na interface.",
      "Antes de aplicar ao real, remover metadados de teste e gravar apenas campos permitidos.",
    ],
    blockedActions: [
      "Ler ou alterar activeFragment.",
      "Exibir seletor de fragmentos.",
      "Misturar tema, menu ou rotas de fragmento com estado simulado.",
      "Persistir id, displayName, origin, type ou isRealUser da marionete.",
    ],
  },
};

export const getYgnAgentContextGuard = (context: YgnOperationalContext) =>
  ygnAgentContextGuards[context];
