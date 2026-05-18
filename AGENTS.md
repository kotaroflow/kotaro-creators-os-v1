# Instrucoes de Idioma e Localizacao

Para este projeto, todas as interfaces, mensagens de erro, labels, menus e qualquer conteudo gerado pela IA devem estar em Portugues (BR), exceto quando o usuario pedir outro idioma.

## Diretrizes de Traducao

- Mantenha termos tecnicos comuns quando nao houver traducao direta adequada.
- "Short Video" -> "Video Curto"
- "Post" -> "Postagem"
- "Story" -> "Story"
- "Draft" -> "Rascunho"
- "Published" -> "Publicado"

## Tom de Voz

- O nome oficial do sistema e YGGNAROK. Use YGN como selo curto, prefixo ou abreviacao.
- O nome antigo Kotaro Creators OS/Kotaro OS/KCOS/KCO esta obsoleto em texto visivel, documentacao nova e comentarios.
- O tom deve ser profissional, tecnologico e epico, referenciando Nazarick/YGGNAROK quando fizer sentido.
- Google Login esta fora do escopo atual. Estrutura futura de autenticacao pode existir, mas sem ativar login Google.
- Agentes/IAs devem ser tratados como modulos funcionais sem avatar, skin, mascote ou tela visual propria por enquanto.
- A prioridade visual atual e recriar e corrigir os cards do Sistema de Evolucao.

## Fluxo de Sincronizacao

- O GitHub deve ser tratado como a fonte principal do projeto.
- Antes de editar, qualquer agente ou ferramenta de IA deve partir da versao mais recente do repositorio central.
- Depois de editar, rode `npm run lint` e `npm run build` antes de enviar as mudancas.
- Nao versionar `node_modules/`, `dist/`, `.npm-cache/`, `.env.local` ou chaves reais.
- Para detalhes do fluxo entre Codex, Google AI Studio e outras ferramentas, leia `docs/SYNC_WORKFLOW.md`.
