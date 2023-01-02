"use client";
import Chat from "../Chat";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import axios from "axios";
import StatBlock from "./StatBlock";
import { useState, useMemo } from "react";

const queryClient = new QueryClient();

export default function PageContainer() {
  return (
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>
  );
}
function Page() {
  const [monster, setMonster] = useState();
  const { mutateAsync: submitMonster, isLoading: isMonsterLoading } =
    useMutation(
      ["monsterChat"],
      ({ text }: { text: string }) =>
        axios.post("/api/monsters/chat", { text }),
      {
        onSuccess: (response) => {
          setMonster(JSON.parse(response.data.response));
        },
      }
    );

  const buildMonster = useMemo(() => {
    return (messages: string[]) => {
      return submitMonster({ text: messages.join(". ") })
        .then((chunk) => {
          return `Here is your ${chunk}`;
        })
        .catch((err) => {
          console.warn("chatgpt error", err);
          return `There was an error processing your request`;
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
          `/api/monsters/test?text=${text}`,
          {}
        );
        es.addEventListener("open", () => console.debug("open"));
        es.addEventListener("error", (e) =>
          console.warn("eventsource error", e)
        );
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
  return (
    <div className="grid grid-cols-2">
      <div className="h-96">
        <Chat
          greeting="Hello, let's have a conversation and build a monster.  Start your first line with 'Describe a' to kick it off.  At any time, use the sync arrows to generate a stat block from our chat"
          onSubmit={onChatInput}
          onActivate={buildMonster}
          onClear={() => setMonster(undefined)}
          isLoading={isMonsterLoading}
        />
      </div>
      <div>
        <StatBlock monster={monster} isLoading={isMonsterLoading} />
      </div>
    </div>
  );
}
