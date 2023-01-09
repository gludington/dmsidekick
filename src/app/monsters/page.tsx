"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import Loading from "../Loading";
import { hasRole } from "../../utils/session";
import NotAuthorized from "../NotAuthorized";
import Monsters from "./monsters";

export default function Page() {
  const session = useSession();

  const authorized = useMemo(
    () => hasRole(session.data, "MONSTER_CREATOR"),
    [session.data]
  );

  return (
    <>
      {!session || session.status === "loading" ? (
        <Loading />
      ) : (
        <>
          {authorized ? <Monsters /> : <NotAuthorized role="Monster Creator" />}
        </>
      )}
    </>
  );
}
