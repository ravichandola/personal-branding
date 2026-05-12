"use client";

import * as React from "react";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import { Toaster } from "sonner";

import { SessionProviderWrapper } from "@/components/layout/session-provider";

import { TooltipProvider } from "@/components/ui/tooltip";

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
          <ReactQueryDevtools initialIsOpen={false} />
        </NextThemesProvider>
      </QueryClientProvider>
    </SessionProviderWrapper>
  );
}
