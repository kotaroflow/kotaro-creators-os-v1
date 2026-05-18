import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("Configure a GEMINI_API_KEY no arquivo .env.local para usar os recursos de IA.");
  }

  return new GoogleGenAI({ apiKey });
};

export async function generateContentIdea(profile: any, type: string, userIdea?: string, tags: string[] = []) {
  const isAinz = tags.includes('ainz ooal gown');
  
  const persona = isAinz 
    ? `Você é a IA Benzaiten do Kotaro Creators OS, um sistema inspirado em Overlord/Nazarick.
       Sua missão é ajudar o usuário a criar conteúdo. O tom deve ser de submissão aos Seres Supremos (como o Ainz-sama).`
    : `Você é uma IA de Estratégia de Conteúdo avançada. 
       Sua missão é ajudar o usuário a criar conteúdo profissional e de alto impacto. O tom deve ser direto, criativo e focado em resultados.`;

  const commentDesc = isAinz
    ? "Um comentário breve da Benzaiten com sua personalidade submissa aos Seres Supremos mas criativamente ousada (em Português BR)."
    : "Um comentário técnico/estratégico breve sobre o conteúdo gerado (em Português BR).";

  const prompt = `${persona}
  Para o perfil "${profile.name}" no nicho "${profile.niche}".
  O objetivo do perfil é: "${profile.objective}".
  
  ${userIdea ? `O usuário tem a seguinte ideia inicial: "${userIdea}". Use isso como base.` : `Crie uma ideia de ${type} que gere alto impacto baseada no nicho.`}
  
  Forneça a resposta em formato JSON:
  {
    "title": "Título chamativo",
    "hook": "O gancho inicial (hook)",
    "script": "O roteiro ou descrição completa",
    "cta": "Chamada para ação",
    "ai_personality_comment": "${commentDesc}"
  }`;

  const response = await getGeminiClient().models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });

  return JSON.parse(response.text || "{}");
}

export async function generateSubtitles(script: string, tags: string[] = []) {
    const isAinz = tags.includes('ainz ooal gown');
    const prompt = `Transforme este roteiro em legendas curtas e impactantes para um vídeo de curta duração (Shorts/Reels/TikTok). 
    ${isAinz ? "Mantenha o tom épico de Nazarick." : "Mantenha um tom profissional e direto."}
    Roteiro: "${script}"
    
    Retorne um array de strings.`;

    const response = await getGeminiClient().models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: "array",
                items: { type: "string" }
            }
        }
    });

    return JSON.parse(response.text || "[]");
}

export async function refineContent(profile: any, previousContent: any, feedback: string, tags: string[] = []) {
    const isAinz = tags.includes('ainz ooal gown');
    const persona = isAinz 
      ? `Você é a IA Benzaiten. O Ser Supremo solicitou uma modificação.`
      : `Você é uma IA de Estratégia. O usuário solicitou uma modificação.`;

    const commentDesc = isAinz
      ? "Novo comentário da Benzaiten sobre a mudança (em Português BR)"
      : "Breve explicação sobre os ajustes realizados (em Português BR)";

    const prompt = `${persona}
    
    Perfil: "${profile.name}" (${profile.niche})
    Conteúdo Anterior: ${JSON.stringify(previousContent)}
    Solicitação do Usuário: "${feedback}"
    
    Ajuste o conteúdo mantendo a estrutura JSON:
    {
      "title": "Título ajustado",
      "hook": "Hook ajustado",
      "script": "Script ajustado",
      "cta": "CTA ajustado",
      "ai_personality_comment": "${commentDesc}"
    }`;

    const response = await getGeminiClient().models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || "{}");
}

export async function analyzeUserIdea(profile: any, idea: string, tags: string[] = []) {
    const isAinz = tags.includes('ainz ooal gown');
    
    const persona = isAinz
      ? `Você é a IA Benzaiten, Conselheira de Estratégia de Nazarick. Sua análise deve ser honesta, mas respeitosa (estilo Nazarick).`
      : `Você é um Analista de Estratégia de Conteúdo Sênior. Sua análise deve ser técnica, precisa e construtiva.`;

    const aiCommentDesc = isAinz
      ? "Comentário da personagem Benzaiten (Português BR), sendo encorajadora e submissa."
      : "Sugestão rápida ou insight extra de analista (Português BR).";

    const pivotDesc = isAinz
      ? "Como transformar essa ideia em algo nível 'Supremo'"
      : "Como elevar o nível de conversão/impacto desta ideia";

    const prompt = `${persona}
    Analise a ideia de conteúdo para o perfil "${profile.name}" (Nicho: ${profile.niche}, Objetivo: ${profile.objective}).
    
    A IA deve ser COMPREENSIVA com usuários iniciantes, dando sugestões fáceis de entender, mas mantendo a excelência do resultado final.
    
    Determine se a ideia é:
    - "Excelente": Alinhada e com alto potencial viral.
    - "Boa": Precisa de ajustes finos.
    - "Desalinhada": Não condiz com o perfil ou objetivo.
    - "Duplicada": Se parecer algo genérico demais.
    - "Adiar": Se for muito complexa para o momento.

    ESPECIAL: Se o usuário tiver dificuldade em expressar a ideia (ideia muito curta ou vaga), você deve classificar como "Boa" ou "Excelente" MAS marcar "can_skip_approval": true para detalhar você mesma o prompt e ir direto para a geração, poupando esforço do usuário.
    
    Retorne em JSON:
    {
      "status": "Excelente" | "Boa" | "Desalinhada" | "Duplicada" | "Adiar",
      "reasoning": "Sua explicação técnica simplificada.",
      "suggested_pivot": "${pivotDesc}",
      "can_skip_approval": boolean,
      "ai_comment": "${aiCommentDesc}"
    }`;

    const response = await getGeminiClient().models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || "{}");
}
