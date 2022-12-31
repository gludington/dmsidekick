import { ReactNode } from "react";
import "./global.css";
import Header from "./Header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>DM Sidekick</title>
      </head>
      <body>
        <Header />
        <main>
          <div className="mx-auto h-full max-w-7xl py-6 sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="px-4 py-2 sm:px-0">{children}</div>
            {/* /End replace */}
          </div>
        </main>
      </body>
    </html>
  );
}
