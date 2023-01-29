"use client";
import { useFetchMonsters } from "../../hooks/monsters";
import type { Monster } from "../../types/global";
import Image from "next/image";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import TableFooter from "../TableFooter";
import Loading from "../Loading";
import { Pencil, Plus, Share } from "./[mid]/components";
const HELPER = createColumnHelper<Monster>();

const columns = [
  HELPER.accessor("id", {}),
  HELPER.accessor("type", {}),
  HELPER.accessor("subType", {}),
  HELPER.accessor("name", {
    header: () => (
      <th
        scope="col"
        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
      >
        Name
      </th>
    ),
    cell: (info) => (
      <>
        <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
          <div className="flex items-center">
            <div className="ml-4">
              <div className="font-medium text-gray-900">
                <Link href={`/monsters/${info.row.getValue("id")}`}>
                  {info.row.getValue("name")}
                </Link>
              </div>
            </div>
          </div>
        </td>
      </>
    ),
    footer: (info) => info.column.id,
  }),
  HELPER.accessor("actions", {
    header: () => (
      <th
        scope="col"
        className="flex justify-end gap-2 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
      >
        <Link href="/monsters/new">
          <button title="Add New Monster" className="standard-button">
            <Plus className="h-6 w-6" />
          </button>
          <span className="sr-only">Add New Monster</span>
        </Link>
        <Link href="/monsters/helper">
          <button
            title="Add New Monster with Helper"
            className="standard-button"
          >
            <Plus className="h-6 w-6" />
            <Image
              className="h-6 w-6"
              width="40"
              height="40"
              src="/dmsidekick.png"
              alt="DM Sidekick"
            />
          </button>
          <span className="sr-only">Add New Monster with Helper</span>
        </Link>
      </th>
    ),
    cell: (info) => (
      <>
        <td
          scope="col"
          className="flex justify-end gap-2 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
        >
          <Link href={`/monsters/${info.row.getValue("id")}`}>
            <button
              title={`Edit ${info.row.getValue("name")}`}
              className="standard-button"
            >
              <Pencil />
            </button>
            <span className="sr-only">
              {`Edit ${info.row.getValue("name")}`}
            </span>
          </Link>
          {/*
          <Link href={`/monsters/${info.row.getValue("id")}`}>
            <button
              title={`Edit ${info.row.getValue("name")}`}
              className="standard-button"
            >
              <Share />
            </button>
            <span className="sr-only">
              {`Export ${info.row.getValue("name")}`}
            </span>
          </Link>
    */}
        </td>
      </>
    ),
    footer: (info) => info.column.id,
  }),
];

export default function Monsters() {
  const { data, isLoading, isPreviousData } = useFetchMonsters();

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

  return (
    <>
      {isLoading || isPreviousData ? (
        <div className="h-53 w-53 fixed top-0 left-0 right-0 bottom-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gray-700 opacity-75">
          <Loading />
        </div>
      ) : null}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <h1 className="text-l font-semibold text-gray-900">Your Monsters</h1>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="table min-w-full divide-y divide-gray-300">
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TableFooter<Monster> data={data} />
    </>
  );
}
