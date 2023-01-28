"use client";
import Loading from "../../Loading";
import Link from "next/link";
import { ReactElement, ReactNode, useState } from "react";
import StatBlock, { PossiblyEditableMonster } from "../StatBlock";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FormikProvider, useFormik } from "formik";
import { Monster } from "../../../types/global";

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

export default function MonsterView(props: any) {
  const { data: roll20, isLoading: isRoll20Loading } = useRoll20Loader();
  const formik = useFormik<PossiblyEditableMonster>({
    initialValues: { editable: true, ...props.monster },
    onSubmit: (values: Monster) => console.warn(values),
  });
  const { values } = formik;
  const [showOptions, setShowOptions] = useState(false);
  return (
    <>
      <div className="mx-auto max-w-md px-6 sm:max-w-3xl lg:max-w-7xl lg:px-8">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight  text-gray-600">
          {values.name}
        </h1>
        <div onClick={() => setShowOptions(!showOptions)}>
          {showOptions ? "Hide" : "Show"} Options
        </div>
        {showOptions ? (
          <>
            {isRoll20Loading ? (
              <Loading />
            ) : (
              <>
                <h2 className="mb-8 text-xl font-extrabold tracking-tight  text-gray-600">
                  Exporting - Roll20
                </h2>
                <ul className="max-w-md list-inside space-y-1">
                  <ListItem
                    text={
                      <span>
                        Copy the API script to clipboard (sorry no one-click
                        install yet; you may also find it{" "}
                        <Link href="/scripts/roll20.js" target="_new">
                          Here
                        </Link>
                      </span>
                    }
                    icon={
                      <ClipboardDocumentIcon
                        className="float-right h-8 w-8"
                        onClick={() => {
                          copyText(roll20);
                        }}
                      />
                    }
                  />
                  <ListItem text="Go to the script/mods section of your Roll20 game. API Access is required, so you must have Roll20 Pro Account" />
                  <ListItem text="Create a new script, and paste the content in" />
                  <ListItem text="Restart your API Sandbox" />
                  <ListItem
                    text={<span>Copy your monster to the clipboard</span>}
                    icon={
                      <ClipboardDocumentIcon
                        className="float-right h-6 w-6"
                        onClick={() => {
                          copyText(JSON.stringify(values));
                        }}
                      />
                    }
                  />
                  <ListItem
                    text={
                      <span>
                        In Roll20 chat, type the command <b>!dmsidekick</b>{" "}
                        followed by a space, paste your monster, and hit return
                      </span>
                    }
                  />
                </ul>
                <p>Your monster will be imported into Roll20</p>
              </>
            )}
          </>
        ) : null}
      </div>
      <FormikProvider value={formik}>
        <StatBlock isLoading={false} />
      </FormikProvider>
      <div className="align-center center my-4 h-1 w-full bg-green-300 px-8"></div>
      <Link href="/monsters" shallow={true}>
        Back to Monsters Page
      </Link>
    </>
  );
}
