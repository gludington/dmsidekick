"use client";

import { useSession } from "next-auth/react";
import {
  Fragment,
  useRef,
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { EyeIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

function DeleteModal({
  open,
  onDelete,
  onClose,
}: {
  open: boolean;
  onDelete: () => void;
  onClose: () => void;
}) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => onClose()}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Restart Conversation
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to restart conversation? The
                          current conversation and stat block will be cleared.
                          This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => onDelete()}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => onClose()}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
export type Message = {
  text: string;
  bot: boolean;
};

const BOT = {
  image: "/dmsidekick.png",
  alt: "DM Sidekick",
  bubbleClass:
    "inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600",
};

// eslint-disable-next-line react/display-name
export const Chat = forwardRef(
  (
    {
      greeting,
      authorized,
      onSubmit,
      onActivate,
      onToggle,
      onClear,
      isLoading,
    }: {
      greeting: string[];
      authorized: boolean;
      onSubmit: (
        messages: string[],
        callback: (chunk: string) => void
      ) => Promise<string>;
      onActivate: (messages: string[]) => void;
      onToggle: () => void;
      onClear: () => void;
      isLoading: boolean;
    },
    ref
  ) => {
    const session = useSession();
    const [text, setText] = useState("");
    const [submission, setSubmission] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [messages, setMessages] = useState<Message[]>(
      greeting.map((greet) => {
        return { text: greet, bot: true };
      })
    );
    const messagesRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      sendBotMessage(text: string) {
        setMessages((mes) => [...mes, { text: text.trim(), bot: true }]);
      },
    }));
    useEffect(() => {
      if (submission.trim().length > 0) {
        setText("");
        setMessages((mes) => [...mes, { text: submission.trim(), bot: false }]);
      }
    }, [submission]);

    const toSend = useMemo(() => {
      return messages
        ? messages.filter((message) => !message.bot).map((m) => m.text)
        : [];
    }, [messages]);

    const disabled = useMemo(() => {
      return isLoading || !authorized;
    }, [isLoading, authorized]);

    useEffect(() => {
      if (
        messages &&
        messages.length > 0 &&
        messages[messages.length - 1]?.bot === false
      ) {
        const msg = { text: "...", bot: true };
        setMessages((mes) => [...mes, msg]);
        let text = "";
        onSubmit(
          messages.filter((message) => !message.bot).map((m) => m.text),
          (chunk: string) => {
            text += chunk;
            setMessages((mes) => [
              ...mes.splice(0, mes.length - 1),
              { text, bot: true },
            ]);
            if (messagesRef?.current) {
              messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
            }
          }
        ).then(() => {
          if (messagesRef?.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
          }
        });
      } else {
        if (messagesRef?.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
      }
    }, [messages, onSubmit]);

    const userInfo = useMemo(() => {
      if (session.data?.user) {
        return {
          image: session.data.user.image,
          alt: session.data.user.name,
          bubbleClass:
            "inline-block rounded-lg rounded-br-none bg-blue-600 px-4 py-2 text-white",
        };
      } else {
        return BOT;
      }
    }, [session.data?.user]);
    return (
      <>
        <DeleteModal
          open={showDeleteModal}
          onDelete={() => {
            setMessages(
              greeting.map((greet) => {
                return { text: greet, bot: true };
              })
            );
            setShowDeleteModal(false);
            onClear();
          }}
          onClose={() => setShowDeleteModal(false)}
        />
        <div className="flex h-[calc(100vh-80px)] flex-1 flex-col sm:h-[calc(100vh-110px)]">
          <div className="flex h-20 justify-between border-b-2 border-gray-200 sm:items-center">
            <div className="relative flex items-center space-x-4">
              <div className="relative">
                <span className="absolute right-0 bottom-0 h-4 w-4 text-green-500 sm:h-6 sm:w-6">
                  <svg width="20" height="20">
                    <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
                  </svg>
                </span>
                <Image
                  width="40"
                  height="40"
                  src="/dmsidekick.png"
                  alt=""
                  className="h-8 w-8 rounded-full sm:h-16 sm:w-16"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <div className="mt-1 flex items-center text-lg sm:text-2xl">
                  <span className="mr-3 text-gray-700">DM Sidekick</span>
                </div>
                <span className="text-base text-gray-600 sm:text-lg">
                  Junior Monster Creator
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                className="h:6 w:6 inline-flex items-center justify-center rounded-lg border text-gray-500 transition duration-500 ease-in-out hover:bg-gray-300 focus:outline-none sm:h-10 sm:w-10"
                onClick={() => setShowDeleteModal(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.515 10.674a1.875 1.875 0 000 2.652L8.89 19.7c.352.351.829.549 1.326.549H19.5a3 3 0 003-3V6.75a3 3 0 00-3-3h-9.284c-.497 0-.974.198-1.326.55l-6.375 6.374zM12.53 9.22a.75.75 0 10-1.06 1.06L13.19 12l-1.72 1.72a.75.75 0 101.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L15.31 12l1.72-1.72a.75.75 0 10-1.06-1.06l-1.72 1.72-1.72-1.72z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="inline-flex h-6 w-6 items-center justify-center rounded-lg border text-gray-500 transition duration-500 ease-in-out hover:bg-gray-300 focus:outline-none sm:h-10 sm:w-10"
                onClick={() => onToggle()}
              >
                <EyeIcon className="v-6 h-6" />
              </button>
              <button
                type="button"
                className="inline-flex h-6 w-6 items-center justify-center rounded-lg border text-gray-500 transition duration-500 ease-in-out hover:bg-gray-300 focus:outline-none disabled:opacity-20 sm:h-10 sm:w-10"
                disabled={disabled || toSend.length === 0}
                onClick={() =>
                  onActivate(
                    messages
                      .filter((message) => !message.bot)
                      .map((m) => m.text)
                  )
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                  />
                </svg>
              </button>
              {/*
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border text-gray-500 transition duration-500 ease-in-out hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border text-gray-500 transition duration-500 ease-in-out hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border text-gray-500 transition duration-500 ease-in-out hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                ></path>
              </svg>
            </button>
      */}
            </div>
          </div>
          <div
            id="messages"
            ref={messagesRef}
            className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex h-full w-full flex-col space-y-4 overflow-y-auto p-3"
          >
            {messages
              ? messages.map((message) => (
                  <div key={message.text} className="chat-message">
                    <div
                      className={`flex items-end${
                        message.bot ? "" : " justify-end"
                      }`}
                    >
                      <div className="order-2 mx-2 flex max-w-xs flex-col items-start space-y-2 text-xs">
                        <div>
                          <span
                            className={
                              message.bot
                                ? BOT.bubbleClass
                                : userInfo?.bubbleClass
                            }
                          >
                            {message.text}
                          </span>
                        </div>
                      </div>
                      {message.bot ? (
                        <Image
                          width="24"
                          height="24"
                          src={BOT.image}
                          alt={BOT.alt}
                          className="order-1 h-6 w-6 rounded-full"
                        />
                      ) : (
                        <img
                          width="24"
                          height="24"
                          src={session?.data?.user?.image || ""}
                          alt={session?.data?.user?.name || ""}
                          className="order-2 h-6 w-6 rounded-full"
                        />
                      )}
                    </div>
                  </div>
                ))
              : null}
          </div>
          <div className="mb-20 h-14 border-t-2 border-gray-200 px-4 pt-4 sm:mb-0 sm:h-20">
            <div className="relative flex">
              <textarea
                placeholder="Describe your monster..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    setSubmission(text);
                  }
                }}
                maxLength={200}
                disabled={disabled}
                overflow-y={false}
                className="mr-5 w-11/12 rounded-md bg-gray-200 py-2 px-2 pl-4 text-gray-600 placeholder-gray-600 focus:placeholder-gray-400 focus:outline-none disabled:text-slate-100"
              />
              <div className="absolute inset-y-0 right-0  w-1/12 items-center sm:flex">
                <button
                  type="button"
                  disabled={disabled}
                  className="inline-flex h-full items-center justify-center rounded-lg bg-blue-500 px-1 py-2 text-white transition duration-500 ease-in-out hover:bg-blue-400 focus:outline-none disabled:opacity-20"
                  onClick={() => {
                    setSubmission(text);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="ml-2 h-6 w-6 rotate-90 transform"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
);
