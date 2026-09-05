"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "helloow_install_dismissed";

// Chrome/Android fire this before showing their own install UI — capturing
// it lets us trigger that same native prompt from our own button instead.
// It has no official TS type since it's a non-standard event.
type BeforeInstallPromptEvent = Event & {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

export function InstallAppBanner() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<"android" | "ios" | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;
    if (isStandalone()) return;

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIOS) setPlatform("ios");

    function handlePrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setPlatform("android");
    }
    window.addEventListener("beforeinstallprompt", handlePrompt);
    return () =>
      window.removeEventListener("beforeinstallprompt", handlePrompt);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    dismiss();
  }

  if (dismissed || !platform) return null;

  return (
    <div className="mb-6 flex items-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm">
      {platform === "android" ? (
        <>
          <Download className="size-5 shrink-0 text-primary" />
          <p className="flex-1">Instale a Helloow Creators no seu celular.</p>
          <Button type="button" size="sm" onClick={install}>
            Instalar app
          </Button>
        </>
      ) : (
        <>
          <Share className="size-5 shrink-0 text-primary" />
          <p className="flex-1">
            Toque em{" "}
            <span className="font-medium text-foreground">Compartilhar</span>{" "}
            e depois em{" "}
            <span className="font-medium text-foreground">
              Adicionar à Tela de Início
            </span>{" "}
            pra instalar o app.
          </p>
        </>
      )}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Fechar"
        className="shrink-0 text-muted-foreground hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
