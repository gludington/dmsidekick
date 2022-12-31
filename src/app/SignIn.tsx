"use client";

import { SessionProvider, signOut, useSession } from "next-auth/react";
import { signIn } from "next-auth/react";

const SignInContainer = () => {
  return (
    <SessionProvider>
      <SignIn />
    </SessionProvider>
  );
};

const SignIn = () => {
  const sessionData = useSession();

  return (
    <>
      <button onClick={sessionData?.data ? () => signOut() : () => signIn()}>
        {sessionData?.data?.user ? sessionData.data.user.name : "Sign in"}
      </button>
    </>
  );
};

export default SignInContainer;
