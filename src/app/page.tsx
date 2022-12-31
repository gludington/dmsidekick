import React, { ReactNode } from "react";
import SignIn from "./SignIn";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export default async function Page({
  leftColumn,
  rightColumn,
}: {
  leftColumn: ReactNode;
  rightColumn: ReactNode;
}) {
  const session = await unstable_getServerSession(authOptions);
  console.warn(session);
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full p-4 md:w-1/2">
        <pre>{JSON.stringify(session, null, 2)}</pre>
        {leftColumn}
      </div>
      <div className="w-full p-4 md:w-1/2">
        <h2>
          <SignIn />
        </h2>
        {rightColumn}
      </div>
    </div>
  );
}
