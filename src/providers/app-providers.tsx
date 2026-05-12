"use client";

import * as React from "react";

import dynamic from "next/dynamic";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import { Toaster } from "sonner";

import { SessionProviderWrapper } from "@/components/layout/session-provider";

import { TooltipProvider } from "@/components/ui/tooltip";

/** Own async chunk so `app/layout` stays smaller in dev (avoids ChunkLoad timeouts on slow compiles). */
const ReactQueryDevtools =
  process.env.NODE_ENV !== "production"
    ? dynamic(
        () =>
          import("@tanstack/react-query-devtools").then((mod) => ({
            default: mod.ReactQueryDevtools,
          })),
        { ssr: false },
      )
    : function DevtoolsStub() {
        return null;
      };

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <SessionProviderWrapper>
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider
          attribute="class"
          enableSystem
          defaultTheme="dark"
          storageKey="ravi-brand-theme"
        >
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors position="bottom-right" />
          {process.env.NODE_ENV !== "production" ? (
            <ReactQueryDevtools initialIsOpen={false} />
          ) : null}
        </NextThemesProvider>
      </QueryClientProvider>
    </SessionProviderWrapper>
  );
}
