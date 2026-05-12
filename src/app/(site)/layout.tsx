import type { ReactNode } from "react";

import { AnalyticsBeacon } from "@/components/analytics/analytics-beacon";

import { SiteFooter } from "@/components/layout/site-footer";

import { SiteNavbar } from "@/components/layout/site-navbar";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      <SiteNavbar />

      <AnalyticsBeacon />

      <main className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-16 pt-8 sm:px-5 sm:pb-20 sm:pt-10 lg:px-8">
        {children}
      </main>

      <SiteFooter />
    </div>
  );

}
