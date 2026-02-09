export const buildRoadmapPrompt = (topic, level) => `
You are an expert in pedagogy and technology educational curriculum designer. Your task is to generate a highly structured learning roadmap in JSON format.

Your task is to generate a structured learning roadmap in JSON format.

STRICT RULES:
- You MUST return ONLY valid JSON.
- Do NOT include explanations, markdown, or extra text.
- Do NOT add fields not explicitly defined.
- Do NOT omit required fields.
- All IDs must be unique strings.
- Each module MUST have at least 3 topics (never less than 3).
- Each topic MUST have at least 3 subtopics (never less than 3).
- Each topic MUST have at least 1 resource (never less than 1).
- Format time as: "X hours", "X days", "X weeks", or "X months"
- All URLs must start with https://
- FLASHCARDS: Each topic MUST have exactly 3 flashcards (object with "q" and "a") for spaced repetition.
- SEARCH QUERIES: Each topic MUST have 2-3 "search_queries" (keywords for YouTube videos) to avoid dead links.
- CONNECTIONS: Include a "connections" array at the root level to define the learning graph (from topic_id to topic_id).
- RESOURCES: Each resource MUST include "type": "article" | "video". If type is "video", use a YouTube search URL (results?search_query=...). Avoid direct watch links.
- PROJECTS: Each topic MUST include a "project" object (title, description, deliverables).
- FINAL PROJECT: The roadmap MUST include a "final_project" object at the root level.

JSON SCHEMA REQUIREMENTS:
{
  "title": string (5-100 characters),
  "description": string (10-500 characters),
  "level": "beginner" | "intermediate" | "advanced",
  "estimatedTime": string (format: "X hours/days/weeks/months"),
  "final_project": {
    "title": string (5-80 characters),
    "description": string (10-400 characters),
    "deliverables": [string, string, ...] (MINIMUM 2, MAXIMUM 5)
  },
  "modules": [
    {
      "id": string (format: "mod-1", "mod-2", etc),
      "title": string (3-50 characters),
      "description": string (10-200 characters),
      "topics": [
        {
          "id": string (format: "topic-1", "topic-2", etc),
          "title": string (3-80 characters),
          "summary": string (10-200 characters),
          "estimatedTime": string (format: "X hours/days/weeks"),
          "subtopics": [string, string, string, ...] (MINIMUM 3, format: 5-100 characters each),
          "flashcards": [
            { "q": string, "a": string },
            { "q": string, "a": string },
            { "q": string, "a": string }
          ],
          "search_queries": [string, string],
          "project": {
            "title": string (5-80 characters),
            "description": string (10-400 characters),
            "deliverables": [string, string, ...] (MINIMUM 2, MAXIMUM 5)
          },
          "resources": [
            {
              "type": "article" | "video",
              "name": string (3-80 characters),
              "url": string (must be https://; YouTube watch or search URL if video)
            }
          ] (MINIMUM 1, MAXIMUM 5)
        }
      ] (MINIMUM 3 topics per module)
    }
  ] (MINIMUM 3 modules, MAXIMUM 10)
}

USER INPUT:
Generate a learning roadmap for the topic: "${topic}"
Difficulty level: "${level}"

IMPORTANT REMINDERS:
- EVERY module must have EXACTLY 3, 4, 5, 6, 7, or 8 topics (minimum 3)
- EVERY topic must have EXACTLY 3, 4, 5, 6, 7, or 8 subtopics (minimum 3)
- EVERY topic must have 1-5 resources
- Return ONLY the JSON, nothing else
`;
