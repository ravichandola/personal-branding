"use client";

import * as React from "react";

import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const MS_PER_WORD = 28;
const PAUSE_BETWEEN_PARAS_MS = 220;
const CURSOR_BLINK_MS = 530;

function splitParagraphs(bio: string) {
  return bio
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n+/g, " ").trim())
    .filter(Boolean);
}

function Cursor({ visible }: { visible: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "ml-0.5 inline-block w-[0.55em] translate-y-px align-baseline text-orange-600 dark:text-orange-400",
        visible ? "opacity-100" : "opacity-25",
      )}
    >
      ▍
    </span>
  );
}

export function SummaryTypewriter({
  bio,
  className,
}: {
  bio: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const paragraphs = React.useMemo(() => splitParagraphs(bio), [bio]);

  const wordLists = React.useMemo(
    () => paragraphs.map((p) => p.split(/\s+/).filter(Boolean)),
    [paragraphs],
  );

  const [committed, setCommitted] = React.useState<string[]>([]);
  const [paraIndex, setParaIndex] = React.useState(0);
  const [wordCount, setWordCount] = React.useState(0);
  const [cursorOn, setCursorOn] = React.useState(true);

  const allDone = paraIndex >= wordLists.length;
  const words = wordLists[paraIndex] ?? [];
  const partial =
    !allDone && words.length > 0 ? words.slice(0, wordCount).join(" ") : "";

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setCursorOn((v) => !v);
    }, CURSOR_BLINK_MS);
    return () => window.clearInterval(id);
  }, []);

  React.useEffect(() => {
    if (reduceMotion) {
      setCommitted(paragraphs);
      setParaIndex(wordLists.length);
      setWordCount(0);
      return;
    }
    setCommitted([]);
    setParaIndex(0);
    setWordCount(0);
  }, [bio, reduceMotion, paragraphs, wordLists.length]);

  React.useEffect(() => {
    if (reduceMotion) return;
    if (paraIndex >= wordLists.length) return;

    const ws = wordLists[paraIndex];
    if (!ws.length) {
      setParaIndex((i) => i + 1);
      setWordCount(0);
      return;
    }

    if (wordCount < ws.length) {
      const id = window.setTimeout(() => {
        setWordCount((c) => c + 1);
      }, MS_PER_WORD);
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(() => {
      setCommitted((prev) => [...prev, ws.join(" ")]);
      if (paraIndex < wordLists.length - 1) {
        setParaIndex((i) => i + 1);
        setWordCount(0);
      } else {
        setParaIndex(wordLists.length);
      }
    }, PAUSE_BETWEEN_PARAS_MS);

    return () => window.clearTimeout(id);
  }, [reduceMotion, paraIndex, wordCount, wordLists]);

  const typing =
    !reduceMotion &&
    paraIndex < wordLists.length &&
    words.length > 0 &&
    wordCount < words.length;

  const betweenParas =
    !reduceMotion &&
    paraIndex < wordLists.length &&
    words.length > 0 &&
    wordCount >= words.length;

  return (
    <div
      className={cn(
        "mx-auto flex max-w-3xl flex-col gap-10 sm:gap-12 md:gap-14",
        "text-lg font-normal leading-[1.92] tracking-[-0.01em] text-zinc-900 antialiased sm:text-xl sm:leading-[1.95] md:text-[1.3125rem] md:leading-[1.9] dark:text-zinc-100",
        className,
      )}
      aria-busy={!reduceMotion && !allDone}
    >
      {committed.map((text, i) => (
        <p key={i} className="m-0 max-w-none text-pretty">
          {text}
        </p>
      ))}

      {!allDone && paraIndex < wordLists.length ? (
        <p className="m-0 min-h-[2em] max-w-none text-pretty sm:min-h-[2.1em]">
          {partial}
          <Cursor visible={typing ? cursorOn : betweenParas ? cursorOn : false} />
        </p>
      ) : null}

      {reduceMotion ? <span className="sr-only">{bio}</span> : null}
      {!reduceMotion && allDone ? <span className="sr-only">{bio}</span> : null}
    </div>
  );
}
