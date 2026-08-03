/* ============================================================
   Conversation memory for the messaging channels.

   In-memory and per-instance: a serverless cold start loses the
   thread and the person simply repeats themselves. That's an
   acceptable trade for a chat bot and avoids requiring a database
   to launch. Swap the Map for Redis/Upstash when conversations
   need to survive deploys.
   ============================================================ */

import type { ChatMessage } from "./engine";

type Session = { messages: ChatMessage[]; updated: number };

const sessions = new Map<string, Session>();

const TTL_MS = 2 * 60 * 60 * 1000; // 2 hours
const MAX_TURNS = 20;
const MAX_SESSIONS = 1000;

function sweep() {
  const now = Date.now();
  for (const [key, s] of sessions) {
    if (now - s.updated > TTL_MS) sessions.delete(key);
  }
  // Hard cap as a backstop against unbounded growth.
  if (sessions.size > MAX_SESSIONS) {
    const oldest = [...sessions.entries()]
      .sort((a, b) => a[1].updated - b[1].updated)
      .slice(0, sessions.size - MAX_SESSIONS);
    for (const [key] of oldest) sessions.delete(key);
  }
}

export function getHistory(key: string): ChatMessage[] {
  sweep();
  const session = sessions.get(key);
  if (!session) return [];
  if (Date.now() - session.updated > TTL_MS) {
    sessions.delete(key);
    return [];
  }
  return session.messages;
}

export function appendTurn(key: string, ...turns: ChatMessage[]) {
  const existing = sessions.get(key)?.messages ?? [];
  const messages = [...existing, ...turns].slice(-MAX_TURNS);
  sessions.set(key, { messages, updated: Date.now() });
  return messages;
}

export function resetSession(key: string) {
  sessions.delete(key);
}
