# Fluxo Unificado de Trabalho

Este projeto deve ter uma unica fonte principal: o repositorio GitHub.

Use este fluxo para evitar que Codex, Google AI Studio, Firebase Studio ou qualquer outra IA trabalhem em copias diferentes do mesmo app.

## Fonte Principal

- Fonte oficial: GitHub.
- Branch principal: `main`.
- Alteracoes de IA: branches curtas como `codex/yggnarok-transition`, `studio/login-fix` ou `ai/simulation-panel`.
- Validacao obrigatoria antes de unir: `npm run lint` e `npm run build`.

## Regra Para Qualquer Ferramenta de IA

Antes de mexer:

1. Puxe a versao mais recente do GitHub.
2. Crie uma branch nova.
3. Faca a alteracao.
4. Rode `npm run lint` e `npm run build`.
5. Envie a branch para o GitHub.
6. Una no `main` somente depois de revisar.

Depois de mexer no Google AI Studio:

1. Exporte ou envie a alteracao para GitHub.
2. Avise as outras ferramentas para puxarem o `main` atualizado.
3. Nunca continue editando uma copia antiga.

## Como Usar Com Google AI Studio

O Google AI Studio pode exportar o app para GitHub. Use isso como saida do Studio para o repositorio central.

Importante: o AI Studio nao e o melhor lugar para ser a fonte unica quando voce tambem usa ferramentas externas. O GitHub deve ser a fonte principal.

Enquanto o projeto ainda nao estiver conectado ao GitHub, use:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/export-google-studio.ps1
```

Esse script gera um ZIP limpo sem `node_modules`, `dist`, `.npm-cache` e chaves locais.

## Como Usar Com Codex

Quando o GitHub estiver conectado, abra o repositorio clonado no Codex e trabalhe sempre nele.

Com Git instalado:

```powershell
git pull origin main
git checkout -b codex/nome-da-mudanca
npm ci
npm run lint
npm run build
git add .
git commit -m "Implementa ajuste"
git push origin codex/nome-da-mudanca
```

## Arquivos Que Nao Devem Ir Para GitHub

- `node_modules/`
- `dist/`
- `.npm-cache/`
- `.env.local`
- `.env.local.txt`
- qualquer chave privada real

Use `.env.example` para mostrar quais variaveis precisam existir, sem colocar segredos reais.

## Checklist Antes de Apresentar o Site

- `npm run lint` passa.
- `npm run build` passa.
- Login e modo de apresentacao abrem.
- Troca de fragmentos funciona.
- Simulador so roda transicao ao ativar simulacao.
- Transicao YGGNAROK nao fica presa.
- Nenhuma chave real foi enviada para GitHub.
