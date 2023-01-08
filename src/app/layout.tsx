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
        <body className="flex h-screen flex-col justify-between">
          <SessionProvider>
            <header>
              <Header />
            </header>
            <main className="mx-auto h-full max-w-7xl py-6 sm:px-6 lg:px-8">
              {/* Replace with your content */}
              <div className="px-4 py-2 sm:px-0">{children}</div>
              {/* /End replace */}
            </main>
            <footer className="h-10 bg-gray-800 text-center text-gray-300">
              Copyright &copy; 2023 DM Sidekick
            </footer>
          </SessionProvider>
        </body>
      </html>
    </QueryClientProvider>
  );
}
