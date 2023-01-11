"use client";

import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";

const faqs: { question: string; answer: ReactNode }[] = [
  {
    question: "Why do I have do sign up?",
    answer:
      "Simply put, hosting costs money.  Each conversation with ChatGPT costs money.  Requiring signup during development keeps those costs under control.",
  },
  {
    question: "How do I sign up?",
    answer: (
      <>
        <a className="u text-blue-600" href="mailto:admin@dmsidekick.com">
          Contact us
        </a>
        . We may not be able to honor all requests, but we will reply.
      </>
    ),
  },
  {
    question: "What about the creatures I create?",
    answer:
      "They are yours, to do with as you wish.  There is no export feature currently, though we are looking at that.",
  },
  {
    question: "Will you ever release this for real?",
    answer:
      "If there is enough interest, though it will probably require a Patreon or similar.",
  },
];
export default function Example() {
  return (
    <section className="">
      <div className="mx-auto max-w-screen-xl py-8 px-4 sm:py-16 lg:px-6">
        <h2 className="mb-8 text-4xl font-extrabold tracking-tight  text-gray-600">
          About DM Sidekick
        </h2>
        <div className="text-leftborder-t border-t border-gray-700 pt-8 text-gray-500 dark:text-gray-400">
          DM Sidekick aims to bring interesting tools to Dungeons and Dragons
          players while giving me the opportunity to play with fun technology.
          The first effort, Monster Helper, is a fun way to build a custom
          monster, chatting with an AI and building a Dungeons and Dragons 5e
          Stat Block from the conversation.
        </div>
      </div>
      <div className="mx-auto max-w-screen-xl py-8 px-4 sm:py-16 lg:px-6">
        <h2 className="mb-8 text-4xl font-extrabold tracking-tight  text-gray-600">
          Frequently asked questions
        </h2>
        <div className="grid border-t border-gray-700 pt-8 text-left md:grid-cols-2 md:gap-16">
          {faqs.map((faq) => (
            <>
              <div className="mb-10">
                <h3 className="mb-4 flex items-center text-lg font-medium  text-gray-600">
                  <QuestionMarkCircleIcon className="mr-4 h-6 w-6 text-gray-500" />
                  {faq.question}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">{faq.answer}</p>
              </div>
            </>
          ))}
        </div>
      </div>
    </section>
  );
}
