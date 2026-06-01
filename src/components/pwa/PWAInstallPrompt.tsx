"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setShowPrompt(false);
      localStorage.setItem("pwa-install-dismissed", "true");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setIsInstalling(true);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      localStorage.setItem("pwa-install-dismissed", "true");
      setShowPrompt(false);
    }
    setIsInstalling(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", "true");
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[60] w-[90vw] max-w-md" style={{ transform: "translateX(-50%)" }}>
      <div className="glass rounded-2xl glow-sm p-4 border border-border/80">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-omix-500 to-omix-700 flex items-center justify-center flex-shrink-0 glow-sm">
            <Icon name="MonitorSmartphone" className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-semibold text-gray-200">Install omixsystems</h4>
              <button
                onClick={handleDismiss}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all -mr-1 -mt-1"
              >
                <Icon name="X" className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Install the school management app for quick access, offline support, and a better experience.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all",
                  "bg-gradient-to-r from-omix-600 to-omix-500 text-white",
                  "hover:from-omix-500 hover:to-omix-400",
                  "shadow-lg shadow-omix-500/25",
                  isInstalling && "opacity-60 cursor-not-allowed"
                )}
              >
                <Icon name="Download" className="w-3.5 h-3.5" />
                {isInstalling ? "Installing..." : "Install App"}
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
