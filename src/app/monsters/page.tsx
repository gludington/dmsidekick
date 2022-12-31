"use client";
import { useState } from "react";
import Chat from "../Chat";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";

const queryClient = new QueryClient();

export default function PageContainer() {
  return (
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>
  );
}
export function Page() {
  const { mutateAsync: submitChat } = useMutation(
    ["monsterChat"],
    ({ text }: { text: string }) => axios.post("/api/monsters/chat", { text })
  );
  return (
    <div className="grid grid-cols-2">
      <div className="h-96">
        <Chat
          greeting="Hello, let's build a monster"
          onSubmit={(text: string) =>
            submitChat({ text }).then((response) => response.data.response)
          }
        />
      </div>
      <div>right</div>
    </div>
  );
}
