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
export function Page() {
  const [monster, setMonster] = useState();
  const { mutateAsync: submitChat, isLoading: isMonsterLoading } = useMutation(
    ["monsterChat"],
    ({ text }: { text: string }) => axios.post("/api/monsters/chat", { text }),
    {
      onSuccess: (response) => {
        setMonster(JSON.parse(response.data.response));
      },
    }
  );
  const onSubmit = useMemo(() => {
    return (messages: string[]) => {
      return submitChat({ text: messages.join(". ") }).then((response) => {
        const data = JSON.parse(response.data.response);
        return `Here is your ${data.name ? data.name : "request"}`;
      });
    };
  }, [submitChat]);
  return (
    <div className="grid grid-cols-2">
      <div className="h-96">
        <Chat
          greeting="Hello, let's build a monster"
          onSubmit={onSubmit}
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
