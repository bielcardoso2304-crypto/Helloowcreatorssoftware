"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const SESSION_KEY = "helloow_splash_shown";

// Each piece of the mark (see public/logo-pieces/) flies in from its own
// direction — radiating outward from where it naturally sits in the full
// mark — and lands in place, so the hand+smile assembles itself on screen.
const PIECES: { id: number; tx: string; ty: string; delay: number }[] = [
  { id: 2, tx: "0%", ty: "-10%", delay: 0 }, // palm/loop — anchor, goes first
  { id: 4, tx: "-160%", ty: "6%", delay: 110 }, // thumb — from the left
  { id: 1, tx: "24%", ty: "-180%", delay: 190 }, // tall finger — from the top
  { id: 3, tx: "150%", ty: "-130%", delay: 270 }, // finger — from the top-right
  { id: 5, tx: "26%", ty: "170%", delay: 350 }, // smile — from below
];

const PIECE_MS = 900;
const ASSEMBLE_MS = Math.max(...PIECES.map((p) => p.delay)) + PIECE_MS;
const HOLD_MS = 850;
const FADE_OUT_MS = 600;

/** Plays once per browser tab session — the first time the app is entered
 * in that tab, whether that's right after logging in or just opening the
 * app with an already-active session. Mounted in the shared (app) layout
 * so it covers every page, desktop and mobile alike. */
export function SplashScreen() {
  const [stage, setStage] = useState<"hidden" | "in" | "out">("hidden");

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");

    setStage("in");
    const fadeTimer = setTimeout(() => setStage("out"), ASSEMBLE_MS + HOLD_MS);
    const doneTimer = setTimeout(
      () => setStage("hidden"),
      ASSEMBLE_MS + HOLD_MS + FADE_OUT_MS
    );
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (stage === "hidden") return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-background",
        stage === "out" &&
          "opacity-0 transition-opacity duration-[600ms] ease-in"
      )}
    >
      <div className="relative aspect-[642/900] h-28 sm:h-36">
        {PIECES.map((piece) => (
          <Image
            key={piece.id}
            src={`/logo-pieces/piece-${piece.id}.png`}
            alt={piece.id === 2 ? "Helloow Creators" : ""}
            width={642}
            height={900}
            priority
            className="absolute inset-0 h-full w-full object-contain opacity-0"
            style={
              {
                "--tx": piece.tx,
                "--ty": piece.ty,
                animation:
                  stage === "in"
                    ? `piece-in ${PIECE_MS}ms cubic-bezier(0.16,1,0.3,1) ${piece.delay}ms forwards`
                    : undefined,
                opacity: stage === "out" ? 1 : undefined,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
