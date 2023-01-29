"use client";
import Loading from "../../Loading";
import Link from "next/link";
import { ReactElement, ReactNode, useState } from "react";
import { useFetchMonster } from "../../../hooks/monsters";
import StatBlock from "../StatBlock";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import MonsterView from "./monster";

function Circle() {
  return (
    <svg
      className="mr-1.5 h-4 w-4 flex-shrink-0 text-green-500 dark:text-green-400"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clip-rule="evenodd"
      ></path>
    </svg>
  );
}

function ListItem({ text, icon }: { text: ReactNode; icon?: ReactElement }) {
  return (
    <li className="flex flex-row justify-between">
      <span className="flex">
        <Circle /> {text}
      </span>
      {icon ? icon : null}
    </li>
  );
}

function copyText(text: string) {
  if (!navigator?.clipboard) {
    return false;
  }
  navigator.clipboard.writeText(text);
}

function useRoll20Loader() {
  const { data, isLoading } = useQuery(["loadRoll20"], async () =>
    axios.get("/scripts/roll20.js").then((response) => response.data)
  );

  return { data, isLoading };
}

export default function Page(props: { params: { mid: string } }) {
  const { data, isLoading } = useFetchMonster(props.params.mid);

  if (isLoading) {
    return <Loading />;
  }
  return <MonsterView monster={data} />;
}
