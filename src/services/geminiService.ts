import { GoogleGenAI } from "@google/genai";
import {
  InMemoryAiCostLedger,
  canRunAiJob,
  createAiUsageId,
  routeAiTask,
} from "./ai";
import type { AiTaskType, CostEstimate } from "./ai";

const GEMINI_TEXT_MODEL = "gemini-3-flash-preview";
const geminiLedger = new InMemoryAiCostLedger();

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("Configure a GEMINI_API_KEY no arquivo .env.local para usar os recursos de IA.");
  }

  return new GoogleGenAI({ apiKey });
};

const planTextRequest = (taskType: AiTaskType, outputSize: "small" | "medium" | "large" = "medium") => {
  const decision = routeAiTask({
    taskType,
    modality: "text",
    promptSize: "medium",
    outputSize,
    policy: {
      preferredProviders: ["google-gemini"],
      costSensitivity: "balanced",
      qualityTarget: "standard",
      maxEstimatedUsd: taskType === "scriptwriting" ? 0.5 : 0.25,
    },
  });

  if (!decision.primary) {
    throw new Error("Nenhum provedor de IA disponivel para esta tarefa dentro do orcamento configurado.");
  }

  const currentSpend = geminiLedger.summarize().totalActualUsd;
  const budgetCheck = canRunAiJob(decision.primary.estimate.maxUsd, currentSpend);

  if (!budgetCheck.allowed) {
    throw new Error("Orcamento de IA atingiu o limite de seguranca. Revise o ledger antes de continuar.");
  }

  return {
    decision,
    providerId: decision.primary.provider.id,
    modelId: decision.primary.model.id,
    estimate: decision.primary.estimate,
  };
};

const recordGeminiUsage = (
  taskType: AiTaskType,
  estimate: CostEstimate,
  status: "succeeded" | "failed",
  notes?: string
) => {
  geminiLedger.recordUsage({
    id: createAiUsageId(),
    providerId: "google-gemini",
    modelId: GEMINI_TEXT_MODEL,
    taskType,
    modality: "text",
    createdAt: new Date().toISOString(),
    estimatedUsd: estimate.maxUsd,
    status,
    notes,
  });
};

const parseJsonResponse = <T>(text: string | undefined, fallback: T): T => {
  if (!text) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.error("Gemini JSON parse error:", error, text);
    return fallback;
  }
};

const runGeminiJson = async <T>(
  taskType: AiTaskType,
  prompt: string,
  fallback: T,
  outputSize: "small" | "medium" | "large" = "medium",
  responseSchema?: object
) => {
  const plan = planTextRequest(taskType, outputSize);

  try {
    const response = await getGeminiClient().models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: responseSchema
        ? { responseMimeType: "application/json", responseSchema }
        : { responseMimeType: "application/json" },
    });

    recordGeminiUsage(taskType, plan.estimate, "succeeded", `Routed by ${plan.modelId}`);
    return parseJsonResponse<T>(response.text, fallback);
  } catch (error) {
    recordGeminiUsage(
      taskType,
      plan.estimate,
      "failed",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
};

export const getGeminiUsageSummary = () => geminiLedger.summarize();

export async function generateContentIdea(profile: any, type: string, userIdea?: string, tags: string[] = []) {
  const isAinz = tags.includes("ainz ooal gown");

  const persona = isAinz
    ? `Voce e a IA Benzaiten do YGGNAROK, um sistema inspirado em Overlord/Nazarick.
       Sua missao e ajudar o usuario a criar conteudo. O tom deve ser leal aos Seres Supremos, com criatividade ousada e respeito ao Ainz-sama.`
    : `Voce e uma IA de estrategia de conteudo avancada.
       Sua missao e ajudar o usuario a criar conteudo profissional, original e de alto impacto. O tom deve ser direto, criativo e focado em resultado.`;

  const commentDesc = isAinz
    ? "Um comentario breve da Benzaiten com personalidade leal aos Seres Supremos, em Portugues BR."
    : "Um comentario tecnico/estrategico breve sobre o conteudo gerado, em Portugues BR.";

  const prompt = `${persona}
  Para o perfil "${profile.name}" no nicho "${profile.niche}".
  O objetivo do perfil e: "${profile.objective}".

  ${
    userIdea
      ? `O usuario tem a seguinte ideia inicial: "${userIdea}". Use isso como base.`
      : `Crie uma ideia de ${type} que gere alto impacto baseada no nicho.`
  }

  Regras:
  - Priorize originalidade e evite copiar obras, marcas, personagens ou roteiros protegidos.
  - Se a ideia tocar em afiliacao, inclua um angulo de conversao sem parecer propaganda agressiva.
  - Fale em Portugues BR.

  Forneca a resposta em JSON:
  {
    "title": "Titulo chamativo",
    "hook": "O gancho inicial",
    "script": "O roteiro ou descricao completa",
    "cta": "Chamada para acao",
    "ai_personality_comment": "${commentDesc}"
  }`;

  return runGeminiJson(
    "scriptwriting",
    prompt,
    {
      title: "",
      hook: "",
      script: "",
      cta: "",
      ai_personality_comment: "",
    },
    "large"
  );
}

export async function generateSubtitles(script: string, tags: string[] = []) {
  const isAinz = tags.includes("ainz ooal gown");
  const prompt = `Transforme este roteiro em legendas curtas e impactantes para video curto (Shorts/Reels/TikTok).
  ${isAinz ? "Mantenha um tom epico de Nazarick." : "Mantenha um tom profissional e direto."}

  Roteiro: "${script}"

  Retorne um array JSON de strings.`;

  return runGeminiJson<string[]>(
    "scriptwriting",
    prompt,
    [],
    "medium",
    {
      type: "array",
      items: { type: "string" },
    }
  );
}

export async function refineContent(profile: any, previousContent: any, feedback: string, tags: string[] = []) {
  const isAinz = tags.includes("ainz ooal gown");
  const persona = isAinz
    ? "Voce e a IA Benzaiten. O Ser Supremo solicitou uma modificacao."
    : "Voce e uma IA de estrategia. O usuario solicitou uma modificacao.";

  const commentDesc = isAinz
    ? "Novo comentario da Benzaiten sobre a mudanca, em Portugues BR."
    : "Breve explicacao sobre os ajustes realizados, em Portugues BR.";

  const prompt = `${persona}

  Perfil: "${profile.name}" (${profile.niche})
  Conteudo anterior: ${JSON.stringify(previousContent)}
  Solicitacao do usuario: "${feedback}"

  Ajuste o conteudo mantendo a estrutura JSON:
  {
    "title": "Titulo ajustado",
    "hook": "Hook ajustado",
    "script": "Script ajustado",
    "cta": "CTA ajustado",
    "ai_personality_comment": "${commentDesc}"
  }`;

  return runGeminiJson(
    "scriptwriting",
    prompt,
    {
      title: previousContent?.title ?? "",
      hook: previousContent?.hook ?? "",
      script: previousContent?.script ?? "",
      cta: previousContent?.cta ?? "",
      ai_personality_comment: "",
    },
    "large"
  );
}

export async function analyzeUserIdea(profile: any, idea: string, tags: string[] = []) {
  const isAinz = tags.includes("ainz ooal gown");

  const persona = isAinz
    ? "Voce e a IA Benzaiten, conselheira de estrategia de Nazarick. Sua analise deve ser honesta, respeitosa e util."
    : "Voce e um analista senior de estrategia de conteudo. Sua analise deve ser tecnica, precisa e construtiva.";

  const aiCommentDesc = isAinz
    ? "Comentario da Benzaiten, encorajador e leal, em Portugues BR."
    : "Sugestao rapida ou insight extra de analista, em Portugues BR.";

  const pivotDesc = isAinz
    ? "Como transformar essa ideia em algo nivel Supremo"
    : "Como elevar o nivel de conversao/impacto desta ideia";

  const prompt = `${persona}
  Analise a ideia de conteudo para o perfil "${profile.name}" (Nicho: ${profile.niche}, Objetivo: ${profile.objective}).

  Ideia do usuario: "${idea}"

  A IA deve ser compreensiva com usuarios iniciantes, dando sugestoes faceis de entender, mas mantendo excelencia no resultado final.

  Determine se a ideia e:
  - "Excelente": alinhada e com alto potencial.
  - "Boa": precisa de ajustes finos.
  - "Desalinhada": nao condiz com o perfil ou objetivo.
  - "Duplicada": parece generica demais ou parecida com algo existente.
  - "Adiar": complexa demais para o momento.

  Especial: se o usuario tiver dificuldade em expressar a ideia, classifique como "Boa" ou "Excelente" e marque "can_skip_approval": true para detalhar o prompt e seguir para geracao.

  Retorne em JSON:
  {
    "status": "Excelente" | "Boa" | "Desalinhada" | "Duplicada" | "Adiar",
    "reasoning": "Explicacao tecnica simplificada.",
    "suggested_pivot": "${pivotDesc}",
    "can_skip_approval": boolean,
    "ai_comment": "${aiCommentDesc}"
  }`;

  return runGeminiJson(
    "analysis",
    prompt,
    {
      status: "Boa",
      reasoning: "",
      suggested_pivot: "",
      can_skip_approval: false,
      ai_comment: "",
    },
    "medium"
  );
}
