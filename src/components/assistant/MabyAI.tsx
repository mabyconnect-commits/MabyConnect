"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Loader2, MessageCircle, Sparkles, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { assistant } from "@/lib/brain/identity";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

/**
 * Renders the Markdown subset the model actually produces: links, bare
 * URLs, **bold** and `code`. Everything else stays literal text.
 *
 * Bold matters more than it looks — the model reaches for it on exactly
 * the things a reader most needs to pick out of a paragraph: an email
 * address, a phone number, a price. Left unhandled it renders as
 * "**hello@mabyconnect.com**", asterisks and all.
 */
function RichText({ text }: { text: string }) {
  const parts = text.split(
    /(\[[^\]\n]+\]\([^)\s]+\)|\*\*[^*\n]+\*\*|`[^`\n]+`|https?:\/\/[^\s<>)]+)/g,
  );

  return (
    <>
      {parts.map((part, i) => {
        const bold = /^\*\*([^*\n]+)\*\*$/.exec(part);
        if (bold) {
          return (
            <strong key={i} className="font-semibold text-white">
              {bold[1]}
            </strong>
          );
        }

        const code = /^`([^`\n]+)`$/.exec(part);
        if (code) {
          return (
            <code
              key={i}
              className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.9em]"
            >
              {code[1]}
            </code>
          );
        }

        const md = /^\[([^\]\n]+)\]\(([^)\s]+)\)$/.exec(part);
        if (md) {
          return (
            <a
              key={i}
              href={md[2]}
              target={md[2].startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="text-gold underline decoration-gold/40 underline-offset-2 hover:decoration-gold"
            >
              {md[1]}
            </a>
          );
        }
        if (/^https?:\/\//.test(part)) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-gold underline decoration-gold/40 underline-offset-2 hover:decoration-gold"
            >
              {part.replace(/^https?:\/\//, "")}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default function MabyAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 350);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setStatus(null);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setMessages([
          ...next,
          {
            role: "assistant",
            content:
              data.error ??
              "I couldn't reach my brain just then. Try again, or email hello@mabyconnect.com.",
          },
        ]);
        return;
      }

      // Append an empty assistant turn we stream into.
      setMessages([...next, { role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const push = (chunk: string) =>
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: copy[copy.length - 1].content + chunk,
          };
          return copy;
        });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line);
            if (event.type === "text") {
              setStatus(null);
              push(event.text);
            } else if (event.type === "tool") {
              setStatus(
                event.name === "capture_lead"
                  ? "Passing your details to Matthew…"
                  : "Checking…",
              );
            } else if (event.type === "error") {
              push(event.message);
            }
          } catch {
            // Ignore a partial line; the next chunk completes it.
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I lost the connection there. Try again, or email hello@mabyconnect.com.",
        },
      ]);
    } finally {
      setBusy(false);
      setStatus(null);
    }
  };

  return (
    <>
      {/* Launcher */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        aria-label={open ? "Close Maby AI" : "Ask Maby AI"}
        className={cn(
          "fixed right-5 bottom-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full shadow-2xl shadow-black/50 transition-colors duration-300",
          open ? "bg-surface text-white" : "bg-gold text-ink hover:bg-white",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "open"}
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-3 bottom-24 z-[70] flex max-h-[min(70vh,600px)] flex-col overflow-hidden rounded-3xl border border-line bg-ink/95 shadow-2xl shadow-black/60 backdrop-blur-xl sm:inset-x-auto sm:right-5 sm:w-[400px]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <Logo className="h-8 w-8" />
              <div className="flex-1">
                <p className="text-sm text-white">{assistant.name}</p>
                <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-faint uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  {assistant.tagline}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-faint transition-colors hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Transcript */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {messages.length === 0 && (
                <div>
                  <div className="flex gap-2.5">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <p className="text-sm leading-relaxed text-mist">
                      {assistant.greeting}
                    </p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {assistant.suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="rounded-full border border-line px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-gold/40 hover:text-white"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                      m.role === "user"
                        ? "bg-gold-soft text-white"
                        : "bg-surface text-mist",
                    )}
                  >
                    {m.content ? (
                      <RichText text={m.content} />
                    ) : (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-faint" />
                    )}
                  </div>
                </div>
              ))}

              {status && (
                <p className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-faint uppercase">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {status}
                </p>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-line p-3">
              <div className="flex items-end gap-2 rounded-2xl border border-line bg-surface/60 px-3 py-2 focus-within:border-gold/40">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  rows={1}
                  maxLength={2000}
                  placeholder={`Ask ${assistant.name} anything…`}
                  className="max-h-24 flex-1 resize-none bg-transparent py-1.5 text-sm text-white placeholder-faint outline-none"
                />
                <button
                  type="button"
                  onClick={() => send(input)}
                  disabled={busy || !input.trim()}
                  aria-label="Send"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-ink transition-opacity disabled:opacity-30"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowUp className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-center font-mono text-[9px] tracking-widest text-faint uppercase">
                {assistant.name} can make mistakes · verify anything important
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
