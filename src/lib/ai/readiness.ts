export const AI_READINESS = {
  vectorDb: "planned",
  openAI: Boolean(process.env.OPENAI_API_KEY),
  langgraph: true,
  telemetry: "dual-write to analytics + future vector store",
  notes:
    "Expose chat through /assistant using LangGraph service once policies are signed-off.",
};

export function describeAIStack() {
  return AI_READINESS;
}
