"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Loader2 } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
            <span className="text-white font-black text-base">S</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
            <span className="text-sm font-medium">Loading Skopos...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-[260px] flex flex-col min-h-screen min-w-0">
        {children}
      </main>
    </div>
  );
}
