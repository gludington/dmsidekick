import { Field } from "formik";
import { HTMLProps, ReactElement, useState } from "react";

export function Check(props: HTMLProps<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export function Pencil(props: HTMLProps<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
      />
    </svg>
  );
}
type TextFieldProps = HTMLProps<HTMLInputElement>;

export function TextField(props: TextFieldProps) {
  return (
    <div className="relative my-4 border-b-2 focus-within:border-blue-500">
      <Field
        name={props.name}
        className="block w-full appearance-none bg-transparent focus:outline-none"
        {...props}
      />
      <label
        className="absolute top-0 origin-0 duration-300"
        htmlFor={props.name}
      >
        {props.label}
      </label>
    </div>
  );
}

type TextAreaProps = HTMLProps<HTMLTextAreaElement>;

export function TextArea(props: TextAreaProps) {
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

export function EditableBlock({
  view,
  edit,
}: {
  view: ReactElement;
  edit: ReactElement;
}) {
  const [showEdit, setShowEdit] = useState(false);
  if (showEdit) {
    return (
      <>
        {edit} <Check onClick={() => setShowEdit(false)} />
      </>
    );
  }
  return (
    <>
      {view}
      <Pencil onClick={() => setShowEdit(true)} />
    </>
  );
}
