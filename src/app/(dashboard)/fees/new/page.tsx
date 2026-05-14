"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NewFeePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/fees");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="glass rounded-2xl p-8 text-center">
        <Loader2 className="w-8 h-8 text-omix-400 animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Redirecting to fees management...</p>
      </div>
    </div>
  );
}
