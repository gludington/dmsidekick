"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { AxiosError } from "axios";
import axios from "axios";
import StatBlock from "../StatBlock";
import { useState, useMemo, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import Loading from "../../Loading";
import { hasRole } from "../../../utils/session";
import { useFetchMonster } from "../../../hooks/monsters";
import { Chat } from "../../Chat";

const GREETING = [
  "Hello, let's have a conversation and build a monster. Start by asking me to describe your monster, like: describe a kobold with an eye patch.",
  "At any time, use the sync arrows to generate a stat block from our chat",
  "When you are done, you can save your monster into your personal bestiary.",
];

const NOT_LOGGED_IN_GREETING = [
  "Before we have a conversation and build a monster, you will have to log in.",
  "Use the button in the upper right.",
];

const NOT_AUTHORIZED_GREETING = [
  "I apologize, but to keep AI costs under control, I am currently under invite-only.",
  "If you would like an invite, please use the link on the home page.",
];

export default function Page() {
  const chatRef = useRef<{ sendBotMessage: (text: string) => void }>();

  const queryClient = useQueryClient();
  const [id, setId] = useState<string | undefined>();

  const { data: monster, isLoading, isError } = useFetchMonster(id);
  useEffect(() => {
    console.warn(id, isLoading);
    if (id && isLoading) {
      const interval = setInterval(() => {
        chatRef.current?.sendBotMessage("Im still thinking...");
      }, 20000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [id, isLoading]);

  useEffect(() => {
    if (Boolean(isError)) {
      chatRef.current?.sendBotMessage("Something went wrong.");
    }
  }, [isError]);

  const { mutateAsync: submitMonster } = useMutation(
    ["monsterChat"],
    ({ text }: { text: string }) => {
      return axios.post("/api/monsters/build", { id: id, text });
    },
    {
      onSuccess: (response) => {
        if (response.data.id) {
          setId(response.data.id);
          queryClient.invalidateQueries(["getMonster", response.data.id]);
          chatRef?.current?.sendBotMessage(
            "Building a beast, this may take a while"
          );
        }
      },
    }
  );

  const buildMonster: (messages: string[]) => void = useMemo(() => {
    return (messages: string[]) => {
      submitMonster({ text: messages.join(". ") })
        .then(async function (response: AxiosResponse) {
          if (response.status !== 201) {
            const err = new AxiosError(
              "Error",
              undefined,
              undefined,
              undefined,
              response
            );
            err.status = response.status;
            chatRef?.current?.sendBotMessage(
              "There was an error in this request"
            );
          } else {
            //queryClient.invalidateQueries(["getMonster", response.data.id]);

            setId(response.data.id);
          }
        })
        .catch(function (err: AxiosError) {
          console.warn("chatgpt error", err);
          chatRef?.current?.sendBotMessage(
            err.status === 403
              ? "Please log in before building any monster"
              : "There was an error processing your request"
          );
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
              ref={chatRef}
              greeting={greeting}
              authorized={authorized}
              onSubmit={onChatInput}
              onActivate={buildMonster}
              onClear={() => setId(undefined)}
              isLoading={isLoading}
            />
          </div>
          <div>
            <StatBlock monster={monster} isLoading={isLoading} />
          </div>
        </>
      )}
    </div>
  );
}
