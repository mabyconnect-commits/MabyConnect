/* ============================================================
   Maby AI speaks one language — Markdown — into three channels that
   each render a different subset of it.

   Nothing instructs the model to avoid Markdown, and nothing should:
   telling a model "don't use formatting" is unreliable, and the web
   chat genuinely wants bold and links. So the model writes Markdown
   once and each channel translates on the way out.

   Left untranslated, "**hello@mabyconnect.com**" reaches the reader
   with the asterisks still attached — which is what was happening.
   ============================================================ */

const BOLD = /\*\*([^*\n]+)\*\*/g;
const LINK = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;
const CODE = /`([^`\n]+)`/g;

/**
 * Telegram, with parse_mode "HTML".
 *
 * HTML mode is used rather than MarkdownV2 because MarkdownV2 requires
 * escaping eighteen characters anywhere they appear — miss one and
 * Telegram rejects the whole message, so the bot goes silent on exactly
 * the replies that contain punctuation. HTML mode needs only &, < and >.
 */
export function toTelegramHtml(md: string): string {
  return (
    md
      // Escape first: everything below emits tags we must not re-escape.
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(LINK, (_m, label: string, url: string) => `<a href="${url}">${label}</a>`)
      .replace(BOLD, "<b>$1</b>")
      .replace(CODE, "<code>$1</code>")
  );
}

/**
 * WhatsApp has its own emphasis syntax (*bold*, _italic_) and no link
 * syntax at all — a bare URL is what becomes tappable, so a Markdown
 * link has to be flattened to "label (url)" or the address is lost.
 */
export function toWhatsAppText(md: string): string {
  return md
    .replace(LINK, (_m, label: string, url: string) =>
      // Don't duplicate when the label already is the URL.
      label.trim() === url.trim() ? url : `${label} (${url})`,
    )
    .replace(BOLD, "*$1*")
    .replace(CODE, "$1");
}

/** Strip formatting entirely — for logs, previews and plain-text fallbacks. */
export function toPlainText(md: string): string {
  return md
    .replace(LINK, (_m, label: string, url: string) =>
      label.trim() === url.trim() ? url : `${label} (${url})`,
    )
    .replace(BOLD, "$1")
    .replace(CODE, "$1");
}
