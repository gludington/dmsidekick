import { ReactNode } from "react";
import "./global.css";
import Header from "./Header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
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
