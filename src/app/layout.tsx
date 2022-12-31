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
        {children}
      </body>
    </html>
  );
}
