"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import "./global.css";
import Header from "./Header";

const queryClient = new QueryClient();

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <head>
          <title>DM Sidekick</title>
          <link
            href="https://fonts.googleapis.com/css?family=Libre+Baskerville:700"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Noto+Sans:400,700,400italic,700italic"
            rel="stylesheet"
            type="text/css"
          />
        </head>
        <body className="flex h-screen flex-col justify-start">
          <SessionProvider>
            <header className="fixed top-0 z-50 w-full">
              <Header />
            </header>
            <main className="h-100 mx-auto w-full max-w-7xl py-14 sm:px-6 lg:px-8">
              <div className="px-4 py-2 sm:px-0">{children}</div>
            </main>
            <footer className="fixed bottom-0 h-10 w-full bg-gray-800 text-center text-gray-300">
              Copyright &copy; 2023 DM Sidekick
            </footer>
          </SessionProvider>
        </body>
      </html>
    </QueryClientProvider>
  );
}
