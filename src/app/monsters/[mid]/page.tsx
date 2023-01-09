"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";

export default function Page() {
  const session = useSession();

  return <h2>hi</h2>;
}
