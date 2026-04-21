"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider } from "./context/theme";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <ThemeProvider>
        <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
