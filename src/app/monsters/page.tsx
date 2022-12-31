"use client";
import { useState } from "react";
import Chat from "../Chat";

export default function Page() {
  return (
    <div className="grid grid-cols-2">
      <div className="h-96">
        <Chat greeting="Hello, let's build a monster" />
      </div>
      <div>right</div>
    </div>
  );
}
