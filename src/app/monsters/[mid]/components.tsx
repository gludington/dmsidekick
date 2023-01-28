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

export function Plus(props: HTMLProps<SVGElement>) {
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
        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
export function Trash(props: HTMLProps<SVGElement>) {
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
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
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
    <div className="relative my-4 w-full border-b-2 border-black focus-within:border-blue-500">
      <Field
        name={props.name}
        className="block w-full appearance-none bg-transparent focus:outline-none"
        {...props}
        as="textarea"
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

export function EditableBlock({
  view,
  edit,
  editable = true,
}: {
  view: ReactElement;
  edit: ReactElement;
  editable: boolean;
}) {
  const [showEdit, setShowEdit] = useState(false);
  if (editable) {
    if (showEdit) {
      return (
        <div className="grid w-full grid-cols-edit-icon p-2">
          <div>{edit}</div> <Check onClick={() => setShowEdit(false)} />
        </div>
      );
    }
    return (
      <div className="grid w-full grid-cols-edit-icon p-2">
        <div>{view}</div>
        <Pencil className="h-4 w-4" onClick={() => setShowEdit(true)} />
      </div>
    );
  }
  return <>{view}</>;
}
