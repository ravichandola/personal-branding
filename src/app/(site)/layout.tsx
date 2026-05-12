import type { ReactNode } from "react";

import { AnalyticsBeacon } from "@/components/analytics/analytics-beacon";

import { SiteFooter } from "@/components/layout/site-footer";

import { SiteNavbar } from "@/components/layout/site-navbar";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      <SiteNavbar />

      <AnalyticsBeacon />

      <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8">
        {children}
      </main>

      <SiteFooter />
    </div>
  );

}
