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

- O tom deve ser profissional, tecnologico e epico, referenciando Nazarick/CREA.OS quando fizer sentido.

## Fluxo de Sincronizacao

- O GitHub deve ser tratado como a fonte principal do projeto.
- Antes de editar, qualquer agente ou ferramenta de IA deve partir da versao mais recente do repositorio central.
- Depois de editar, rode `npm run lint` e `npm run build` antes de enviar as mudancas.
- Nao versionar `node_modules/`, `dist/`, `.npm-cache/`, `.env.local` ou chaves reais.
- Para detalhes do fluxo entre Codex, Google AI Studio e outras ferramentas, leia `docs/SYNC_WORKFLOW.md`.
