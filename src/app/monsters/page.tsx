"use client";
import Chat from "../Chat";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axios from "axios";
import StatBlock from "./StatBlock";
import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import Loading from "../Loading";
import { hasRole } from "../../utils/session";
import { convert, toJSON } from "../../utils/conversions";

const queryClient = new QueryClient();

export default function PageContainer() {
  return (
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>
  );
}

const GREETING = [
  "Hello, let's have a conversation and build a monster.",
  "Start by asking me to describe your monster, like: describe a kobold with an eye patch.",
  "At any time, use the sync arrows to generate a stat block from our chat",
];

const NOT_LOGGED_IN_GREETING = [
  "Before we have a conversation and build a monster, you will have to log in.",
  "Use the button in the upper right.",
];

const NOT_AUTHORIZED_GREETING = [
  "I apologize, but to keep AI costs under control, I am currently under invite-only.",
  "If you would like an invite, please use the link on the home page.",
];

function Page() {
  const [monster, setMonster] = useState();
  const { mutateAsync: submitMonster, isLoading: isMonsterLoading } =
    useMutation(
      ["monsterChat"],
      ({ text }: { text: string }) =>
        axios.post("/api/monsters/build", { text }),
      {
        onSuccess: (response) => {
          setMonster(response.data);
        },
      }
    );

  const buildMonster = useMemo(() => {
    return (messages: string[]) => {
      return new Promise<string>((resolve, reject) => {
        return submitMonster({ text: messages.join(". ") })
          .then((chunk) => {
            resolve(chunk.data);
          })
          .catch((err: AxiosError) => {
            console.warn("chatgpt error", err);
            reject(
              err.status === 403
                ? "Please log in before building any monster"
                : "There was an error processing your request"
            );
          });
      });
    };
  }, []);
  const streamSubmit = useMemo(() => {
    return ({
      text,
      callback,
    }: {
      text: string;
      callback: (chunk: string) => void;
    }) => {
      return new Promise((resolve, reject) => {
        const es: EventSource = new EventSource(
          `/api/monsters/chat?text=${text}`,
          {}
        );
        es.addEventListener("open", () => console.debug("open"));
        es.addEventListener("error", (e) => {
          callback("Please log in if you have not done so.");
          resolve("DONE");
        });
        es.addEventListener("message", (evt: MessageEvent) => {
          if (evt.data === "[DONE]") {
            es.close();
            resolve("DONE");
          } else {
            callback(evt.data);
          }
        });
      });
    };
  }, []);
  const onChatInput = useMemo(() => {
    return (messages: string[], callback: (chunk: string) => void) => {
      return streamSubmit({ text: messages.join(". "), callback })
        .then((chunk) => {
          return `Here is your ${chunk}`;
        })
        .catch((err) => {
          console.warn("chatgpt error", err);
          return `There was an error processing your request`;
        });
    };
  }, [streamSubmit]);
  const session = useSession();

  const greeting = useMemo(
    () =>
      session.data?.user
        ? hasRole(session.data, "MONSTER_CREATOR")
          ? GREETING
          : NOT_AUTHORIZED_GREETING
        : NOT_LOGGED_IN_GREETING,
    [session.data]
  );

  const authorized = useMemo(
    () => hasRole(session.data, "MONSTER_CREATOR"),
    [session.data]
  );

  return (
    <div className="grid grid-cols-2">
      {!session || session.status === "loading" ? (
        <Loading />
      ) : (
        <>
          <div className="h-96">
            <Chat
              greeting={greeting}
              authorized={authorized}
              onSubmit={onChatInput}
              onActivate={buildMonster}
              onClear={() => setMonster(undefined)}
              isLoading={isMonsterLoading}
            />
          </div>
          <div>
            <StatBlock monster={monster} isLoading={isMonsterLoading} />
          </div>
        </>
      )}
    </div>
  );
}
