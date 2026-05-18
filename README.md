<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/c4b14dfc-4366-4a11-b471-7e071bd7729d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Unified Workflow

Use GitHub as the single source of truth when working with Codex, Google AI Studio, Firebase Studio, or other AI tools.

Read the full workflow in [docs/SYNC_WORKFLOW.md](docs/SYNC_WORKFLOW.md).

## OS Architecture Notes

The base for backend migration, AI provider routing, cost control, storage strategy, and official platform data ingestion is documented in [docs/OS_INFRA_AI_DATA_ROADMAP.md](docs/OS_INFRA_AI_DATA_ROADMAP.md).

Current naming, auth, agent and evolution-card rules are documented in [docs/YGGNAROK_PROJECT_RULES.md](docs/YGGNAROK_PROJECT_RULES.md).

To create a clean ZIP for Google AI Studio while GitHub is not connected:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/export-google-studio.ps1
```
