import type { ReactElement } from "react";

export default function NotAuthorized({
  role,
  children,
}: {
  role: string;
  children?: ReactElement;
}) {
  return (
    <>
      <h2 className="mb-8 text-4xl font-extrabold tracking-tight  text-gray-600">
        Not Authorized
      </h2>
      <div className="text-leftborder-t border-t border-gray-700 pt-8 text-gray-500 dark:text-gray-400">
        You have reached a page that requires the {role} role. Please Contact Us
        if this is mistaken, or to request this role.
      </div>
      {children}
    </>
  );
}
