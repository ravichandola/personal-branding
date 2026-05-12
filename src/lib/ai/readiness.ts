export const AI_READINESS = {
  vectorDb: "planned",
  openAI: Boolean(process.env.OPENAI_API_KEY),
  langgraph: true,
  telemetry: "dual-write to analytics + future vector store",
  notes:
    "Wire LangGraph-backed chat via AiExtension once policies are signed-off.",
};

export function describeAIStack() {
  return AI_READINESS;
}
