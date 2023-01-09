"use client";
import { useFetchMonsters } from "../../hooks/monsters";
import type { Monster, MonsterSearchResults } from "../../types/global";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import TableFooter from "../TableFooter";
import { useMemo } from "react";
const HELPER = createColumnHelper<Monster>();

const columns = [
  HELPER.accessor("id", {}),
  HELPER.accessor("type", {}),
  HELPER.accessor("subType", {}),
  HELPER.accessor("name", {
    header: (info) => (
      <th
        scope="col"
        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
      >
        Name
      </th>
    ),
    cell: (info) => (
      <>
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
          <div className="flex items-center">
            <div className="h-10 w-10 flex-shrink-0">
              <img className="h-10 w-10 rounded-full" src={"#"} alt="" />
            </div>
            <div className="ml-4">
              <div className="font-medium text-gray-900">
                <Link href={`/monsters/${info.row.getValue("id")}`}>
                  {info.row.getValue("name")}
                </Link>
              </div>
              <div className="text-gray-500">
                {info.row.getValue("type")}
                {info.row.getValue("subType")
                  ? ` (${info.row.getValue("subType")})`
                  : null}
              </div>
            </div>
          </div>
        </td>
      </>
    ),
    footer: (info) => info.column.id,
  }),
];

export default function Monsters() {
  const { data, isLoading, isError } = useFetchMonsters();

  const table = useReactTable({
    data: data?.content || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnVisibility: {
        id: false,
        type: false,
        subType: false,
        name: true,
      },
    },
  });

  const rows = useMemo(() => {
    if (data?.content) {
      return data.content;
    }
    return [];
  }, [data]);
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Monsters</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the monsters in your account.
            </p>
          </div>
          <div className="mt-4 space-x-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add Monster
            </button>
            <Link href="/monsters/helper">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Add Monster with Helper
              </button>
            </Link>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </th>
                        ))}
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Actions</span>
                          Edit
                        </th>
                      </tr>
                    ))}
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.getValue("id")}>
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link
                            href={`/monsters/${row.getValue("id")}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                              Edit
                            </span>
                            <span className="sr-only">oh boy</span>
                          </Link>
                          <Link
                            href={`/monsters/${row.getValue("id")}/export`}
                            prefetch={false}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                              Export
                            </span>
                            <span className="sr-only">oh boy</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TableFooter<MonsterSearchResults> data={data} />
      {/* a dynamic example
      <div className="p-2">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
        <h2>bottom</h2>
        <div className="h-4" />
          </div>
                      */}
    </>
  );
}
