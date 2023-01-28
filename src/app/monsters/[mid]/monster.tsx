"use client";
import Loading from "../../Loading";
import Link from "next/link";
import { HTMLProps, ReactElement, ReactNode, useState } from "react";
import { useFetchMonster } from "../../../hooks/monsters";
import StatBlock from "../StatBlock";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Field, FieldArray, FormikProvider, useFormik } from "formik";
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

type TextFieldProps = HTMLProps<HTMLInputElement>;

function TextField(props: TextFieldProps) {
  return (
    <div className="border">
      <label
        className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0"
        htmlFor={props.name}
      >
        {props.label}
      </label>
      <Field name={props.name} className="w-full" {...props} />
    </div>
  );
}

type TextAreaProps = HTMLProps<HTMLTextAreaElement>;

function TextArea(props: TextAreaProps) {
  return (
    <div className="border">
      <label
        className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0"
        htmlFor={props.name}
      >
        {props.label}
      </label>
      <Field name={props.name} className="w-full" {...props} as="textarea" />
    </div>
  );
}

export default function MonsterView(props: any) {
  const { data: roll20, isLoading: isRoll20Loading } = useRoll20Loader();
  const formik = useFormik<Monster>({
    initialValues: props.monster,
    onSubmit: (values: Monster) => console.warn(values),
  });
  const { values } = formik;
  const [panel, setPanel] = useState(true);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      <div className={`h-full${panel ? "" : " hidden sm:block"}`}>
        <div className="mx-auto max-w-md px-6 sm:max-w-3xl lg:max-w-7xl lg:px-8">
          <h1 className="mb-8 text-4xl font-extrabold tracking-tight  text-gray-600">
            {values.name}
          </h1>
          <FormikProvider value={formik}>
            <div className="flex flex-col">
              <TextField name="name" label="Name" />
              <div className="flex gap-3">
                <TextField name="size" label="Size" />
                <TextField name="type" label="Type" />
                <TextField name="subType" label="Sub-Type" />
                <TextField name="alignment" label="Alignment" />
              </div>
              <div className="flex gap-3">
                <TextField
                  name="armorClass"
                  label="Armor Class"
                  type="number"
                />
                <TextField name="hitPoints" label="Hit Points" type="number" />
                <TextField name="hitDice" label="Hit Dice" />
              </div>
              <TextField name="speed" label="Speed" />
              <div className="flex gap-3">
                <TextField
                  name="attributes.strength"
                  label="STR"
                  type="number"
                />
                <TextField
                  name="attributes.dexterity"
                  label="DEX"
                  type="number"
                />
                <TextField
                  name="attributes.constitution"
                  label="CON"
                  type="number"
                />
                <TextField
                  name="attributes.intelligence"
                  label="INT"
                  type="number"
                />
                <TextField name="attributes.wisdom" label="WIS" type="number" />
                <TextField
                  name="attributes.charisma"
                  label="CHA"
                  type="number"
                />
              </div>
              <h3>Saving Throws (0 or blank to leave empty)</h3>
              <div className="flex gap-3">
                <TextField name="saves.strength" label="STR" type="number" />
                <TextField name="saves.dexterity" label="DEX" type="number" />
                <TextField
                  name="saves.constitution"
                  label="CON"
                  type="number"
                />
                <TextField
                  name="saves.intelligence"
                  label="INT"
                  type="number"
                />
                <TextField name="saves.wisdom" label="WIS" type="number" />
                <TextField name="saves.charisma" label="CHA" type="number" />
              </div>
              <FieldArray name="specialAbilities">
                {(arrayHelpers) => (
                  <>
                    <h1>
                      Abilities{" "}
                      <button
                        onClick={() =>
                          arrayHelpers.push({ name: "", description: "" })
                        }
                      >
                        CLICK ME
                      </button>
                    </h1>
                    <div className="mx-4 grid grid-cols-2">
                      {values?.specialAbilities.map((spec, index) => (
                        <>
                          <div key={`specialAbilities.${index}`}>
                            <TextField
                              name={`specialAbilities.${index}.name`}
                              label="Name"
                            />
                            <TextArea
                              name={`specialAbilities.${index}.description`}
                              label="Description"
                              rows={4}
                            />
                          </div>
                          <button onClick={() => arrayHelpers.remove(index)}>
                            DELETE
                          </button>
                        </>
                      ))}
                    </div>
                  </>
                )}
              </FieldArray>
            </div>
          </FormikProvider>
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
        </div>
        <div className="align-center center my-4 h-1 w-full bg-green-300 px-8"></div>
        <Link href="/monsters" shallow={true}>
          Back to Monsters Page
        </Link>
      </div>
      <FormikProvider value={formik}>
        <div className={`h-full${!panel ? "" : " hidden sm:block"}`}>
          <StatBlock monster={values} isLoading={false} />
        </div>
      </FormikProvider>
    </div>
  );
}
