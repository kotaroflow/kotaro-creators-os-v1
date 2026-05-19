# YGGNAROK - Regras Atuais do Projeto

Data: 2026-05-18

## Nome oficial

- Nome oficial: **YGGNAROK**
- Selo curto: **YGN**
- Nomes antigos como Kotaro Creators OS, Kotaro OS, KCO e KCOS estao obsoletos.
- Textos visiveis, documentacao nova, comentarios novos e componentes novos devem usar YGGNAROK/YGN.

## Autenticacao

- Google Login esta fora do escopo atual.
- O fluxo atual usa acesso local de desenvolvimento.
- Firebase pode continuar como dependencia temporaria de dados legados, mas nao deve ser tratado como nucleo final.
- Uma estrutura futura de autenticacao pode existir, desde que nao ative Google Login agora.

## Agentes/IAs

Agentes/IAs existem como modulos funcionais:

- nome;
- funcao;
- regras;
- permissoes;
- contexto;
- acoes permitidas;
- acoes bloqueadas;
- logs.

Regras obrigatorias para agentes:

- varios usuarios sao padrao do OS;
- um usuario pode cuidar de um ou mais perfis;
- sempre checar vinculo usuario-perfil antes de sugerir leitura, escrita ou automacao;
- fragmentos pertencem a conta suprema e sao foco operacional real;
- simulacao pertence a conta suprema e roda no perfil fixo YGN Sandbox;
- agentes nao podem misturar fragmento com simulacao;
- em simulacao, agentes nao devem ler nem alterar MATHEUS, KOTARO ou MOMONGA;
- YGN Sandbox nao deve carregar dois perfis reais ao mesmo tempo.

Nao criar agora:

- avatar;
- mascote;
- skin;
- card visual individual;
- tela visual propria de agente.

## Prioridade visual

A prioridade visual atual e o **Sistema de Evolucao**.

Os cards de evolucao sao componentes centrais do OS e devem carregar:

- identidade YGGNAROK/YGN;
- glassmorphism moderno;
- XP;
- rank;
- level;
- karma;
- kanji/conceito japones quando aplicavel;
- estados de bloqueado, proximo, desbloqueado e atual;
- suporte para usuario e admin.

## Backend/dados

A base de dados futura precisa suportar:

- usuarios;
- perfis;
- cards de evolucao;
- eventos de XP;
- regras de rank;
- agentes funcionais;
- permissoes;
- logs;
- jobs de IA;
- ledger de custo;
- midia;
- contas externas;
- metricas reais.

Blueprint inicial em `src/services/backend/yggnarokDataModel.ts`.
