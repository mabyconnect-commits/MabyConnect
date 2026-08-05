"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Handshake,
  Loader2,
  Map as MapIcon,
  Sparkles,
} from "lucide-react";
import { bookingSlots, bookingTimezone, callTypes } from "@/lib/agency";
import { submitBooking, type SubmitState } from "@/app/agency/actions";
import { cn } from "@/lib/utils";

const icons = {
  spark: Sparkles,
  map: MapIcon,
  code: Code2,
  handshake: Handshake,
} as const;

const weekdayLabels = ["M", "T", "W", "T", "F", "S", "S"];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Weekends are unavailable, as is anything in the past. */
function isBookable(day: Date, today: Date) {
  const weekday = day.getDay();
  if (weekday === 0 || weekday === 6) return false;
  return day.getTime() >= startOfDay(today).getTime();
}

/**
 * Builds the calendar grid for a month, padded so the 1st lands under the
 * correct weekday column (Monday-first).
 */
function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // getDay(): 0 = Sunday. Shift so Monday = 0.
  const lead = (first.getDay() + 6) % 7;

  const cells: (Date | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push(new Date(year, month, d));
  }
  return cells;
}

export default function BookingFlow() {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [callType, setCallType] = useState<string>(callTypes[0].value);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [details, setDetails] = useState({
    name: "",
    email: "",
    company: "",
    notes: "",
    website: "",
  });
  const [state, setState] = useState<SubmitState>({ status: "idle", message: "" });
  const [pending, startTransition] = useTransition();

  const cells = useMemo(
    () => monthGrid(cursor.getFullYear(), cursor.getMonth()),
    [cursor],
  );

  const monthLabel = cursor.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const atFirstMonth =
    cursor.getFullYear() === today.getFullYear() &&
    cursor.getMonth() === today.getMonth();

  const selectedType = callTypes.find((c) => c.value === callType)!;
  const ready = Boolean(date && time && details.name && details.email);

  const send = () => {
    if (!date || !time) return;
    startTransition(async () => {
      const result = await submitBooking({
        ...details,
        callType: selectedType.name,
        date: date.toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        time,
        timezone: bookingTimezone,
      });
      setState(result);
    });
  };

  /* ---------------- Confirmation ---------------- */
  if (state.status === "success" && date && time) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-line bg-surface/40 p-10 md:p-14"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-soft">
          <Check className="h-6 w-6 text-gold" />
        </span>
        <h2 className="display mt-8 text-3xl text-white md:text-5xl">
          You&apos;re booked.
        </h2>
        <p className="mt-4 max-w-lg text-lg text-mist">{state.message}</p>

        <dl className="mt-10 divide-y divide-line rounded-2xl border border-line">
          {[
            { label: "Call", value: `${selectedType.name} · ${selectedType.duration}` },
            {
              label: "Date",
              value: date.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
              }),
            },
            { label: "Time", value: `${time} · ${bookingTimezone}` },
            ...(state.reference
              ? [{ label: "Reference", value: state.reference }]
              : []),
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-6 px-5 py-4"
            >
              <dt className="font-mono text-[10px] tracking-widest text-faint uppercase">
                {row.label}
              </dt>
              <dd className="text-right text-sm text-white/85">{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/agency/start"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-gold"
          >
            Send your spec ahead of the call
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/agency"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-3.5 text-sm text-white transition-colors hover:border-white"
          >
            Back to the agency
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
      {/* Left: type + calendar */}
      <div>
        {/* Call type */}
        <p className="eyebrow mb-5">01 — What kind of call?</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {callTypes.map((c) => {
            const Icon = icons[c.icon];
            const selected = callType === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => setCallType(c.value)}
                aria-pressed={selected}
                className={cn(
                  "group flex flex-col rounded-2xl border p-5 text-left transition-all duration-300",
                  selected
                    ? "border-gold/50 bg-gold-soft"
                    : "border-line bg-surface/40 hover:border-line-strong hover:bg-surface",
                )}
              >
                <div className="flex items-center justify-between">
                  <Icon className={cn("h-4 w-4", selected ? "text-gold" : "text-faint")} />
                  <span className="font-mono text-[10px] tracking-widest text-faint uppercase">
                    {c.duration}
                  </span>
                </div>
                <span className="mt-4 text-base text-white">{c.name}</span>
                <span className="mt-2 text-sm leading-relaxed text-faint">
                  {c.summary}
                </span>
              </button>
            );
          })}
        </div>

        {/* Calendar */}
        <p className="eyebrow mt-12 mb-5">02 — Pick a day</p>
        <div className="rounded-3xl border border-line bg-surface/40 p-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
              }
              disabled={atFirstMonth}
              aria-label="Previous month"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-white/70 transition-colors hover:border-line-strong hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="display text-lg text-white">{monthLabel}</span>
            <button
              type="button"
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
              }
              aria-label="Next month"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-white/70 transition-colors hover:border-line-strong hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-1">
            {weekdayLabels.map((d, i) => (
              <span
                key={i}
                className="pb-2 text-center font-mono text-[10px] tracking-widest text-faint uppercase"
              >
                {d}
              </span>
            ))}

            {cells.map((day, i) => {
              if (!day) return <span key={`pad-${i}`} />;
              const bookable = isBookable(day, today);
              const selected = date ? isSameDay(day, date) : false;
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={!bookable}
                  onClick={() => {
                    setDate(day);
                    setTime(null);
                  }}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-xl text-sm transition-all duration-200",
                    selected
                      ? "bg-gold font-medium text-ink"
                      : bookable
                        ? "text-white/80 hover:bg-elevate hover:text-white"
                        : "cursor-not-allowed text-white/15",
                  )}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          <p className="mt-5 flex items-center gap-2 border-t border-line pt-4 font-mono text-[10px] tracking-widest text-faint uppercase">
            <Clock className="h-3 w-3" /> {bookingTimezone}
          </p>
        </div>

        {/* Times */}
        {date && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="eyebrow mt-12 mb-5">03 — Pick a time</p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {bookingSlots.map((slot) => {
                const selected = time === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    aria-pressed={selected}
                    className={cn(
                      "rounded-xl border py-3 text-sm transition-all duration-200",
                      selected
                        ? "border-gold bg-gold-soft text-white"
                        : "border-line text-white/75 hover:border-line-strong hover:text-white",
                    )}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Right: summary + details */}
      <div className="h-fit lg:sticky lg:top-28">
        <div className="rounded-3xl border border-line bg-surface/40 p-8">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-4 w-4 text-gold" />
            <span className="eyebrow">Your booking</span>
          </div>

          <dl className="mt-6 divide-y divide-line border-y border-line">
            {[
              { label: "Call", value: `${selectedType.name} · ${selectedType.duration}` },
              {
                label: "Date",
                value: date
                  ? date.toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })
                  : "—",
              },
              { label: "Time", value: time ?? "—" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-4 py-3"
              >
                <dt className="font-mono text-[10px] tracking-widest text-faint uppercase">
                  {row.label}
                </dt>
                <dd
                  className={cn(
                    "text-right text-sm",
                    row.value === "—" ? "text-faint" : "text-white/85",
                  )}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="eyebrow mt-8 mb-4">04 — Your details</p>
          <div className="space-y-3">
            <input
              value={details.name}
              onChange={(e) => setDetails({ ...details, name: e.target.value })}
              placeholder="Your name"
              autoComplete="name"
              className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-white placeholder-faint outline-none transition-colors focus:border-gold"
            />
            <input
              value={details.email}
              onChange={(e) => setDetails({ ...details, email: e.target.value })}
              placeholder="Email address"
              type="email"
              autoComplete="email"
              className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-white placeholder-faint outline-none transition-colors focus:border-gold"
            />
            <input
              value={details.company}
              onChange={(e) => setDetails({ ...details, company: e.target.value })}
              placeholder="Company (optional)"
              autoComplete="organization"
              className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-white placeholder-faint outline-none transition-colors focus:border-gold"
            />
            <textarea
              value={details.notes}
              onChange={(e) => setDetails({ ...details, notes: e.target.value })}
              placeholder="What do you want to build?"
              rows={3}
              className="w-full resize-none rounded-xl border border-line bg-ink px-4 py-3 text-sm text-white placeholder-faint outline-none transition-colors focus:border-gold"
            />
            {/* Honeypot */}
            <input
              value={details.website}
              onChange={(e) => setDetails({ ...details, website: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="hidden"
            />
          </div>

          {state.status === "error" && (
            <p className="mt-4 text-sm text-gold">{state.message}</p>
          )}

          <button
            type="button"
            onClick={send}
            disabled={!ready || pending}
            className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-medium text-ink transition-colors hover:bg-gold disabled:opacity-40"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Confirming
              </>
            ) : (
              <>
                Confirm booking
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          {!ready && (
            <p className="mt-4 text-center text-xs text-faint">
              Pick a day, a time, and add your name and email.
            </p>
          )}
        </div>

        <Link
          href="/agency/start"
          className="mt-6 inline-flex items-center gap-2 text-sm text-faint transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Rather scope it first?
        </Link>
      </div>
    </div>
  );
}
