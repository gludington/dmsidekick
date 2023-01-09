import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { SearchResults } from "../types/global";

const MAX_PAGE_ON_EITHER_SIDE = 3;
export default function TableFooter<T>({ data }: { data?: SearchResults<T> }) {
  const searchParams = useSearchParams();
  const pathname = usePathname() ?? "";
  const params = useMemo(() => {
    if (data) {
      const page = data.page + 1;
      const start = data.page * data.size + 1;
      const end = data.page * data.size + data.size;

      let firstPage = page;
      let sz = MAX_PAGE_ON_EITHER_SIDE;
      while (sz-- > 0 && firstPage * data.size - data.size > 1) {
        firstPage = firstPage - 1;
      }
      let lastPage = page;
      sz = MAX_PAGE_ON_EITHER_SIDE;
      while (sz-- > 0 && lastPage * data.size + data.size <= data.total) {
        lastPage = lastPage + 1;
      }
      const pages: number[] = [];
      for (let idx = firstPage; idx <= lastPage; idx++) {
        pages.push(idx);
      }

      return {
        start,
        end,
        page,
        pages,
        showPrev: start > 1,
        showNext: end < data.total,
        displayEnd: end > data.total ? data.total : end,
      };
    }
    return {};
  }, [data]);
  if (!data) {
    return null;
  }
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className={`flex flex-1 justify-between sm:hidden`}>
        {params.showPrev ? (
          <Link
            href={{
              pathname,
              query: {
                ...Object.fromEntries(searchParams.entries()),
                page: params.page - 1,
              },
            }}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </Link>
        ) : null}
        {params.showNext ? (
          <Link
            href={{
              pathname,
              query: {
                ...Object.fromEntries(searchParams.entries()),
                page: params.page + 1,
              },
            }}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </Link>
        ) : null}
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{params.start}</span> to{" "}
            <span className="font-medium">{params.displayEnd}</span> of{" "}
            <span className="font-medium">{data.total}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {params.showPrev ? (
              <Link
                href={{
                  pathname,
                  query: {
                    ...Object.fromEntries(searchParams.entries()),
                    page: params.page - 1,
                  },
                }}
                className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </Link>
            ) : null}
            {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}

            {params.pages?.map((page) => (
              <>
                {page === params.page ? (
                  <a
                    href="#"
                    aria-current="page"
                    className="relative z-10 inline-flex items-center border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20"
                  >
                    {page}
                  </a>
                ) : (
                  <Link
                    href={{
                      pathname,
                      query: {
                        ...Object.fromEntries(searchParams.entries()),
                        page: page,
                      },
                    }}
                    className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                  >
                    {page}
                  </Link>
                )}
              </>
            ))}
            {params.showNext ? (
              <Link
                href={{
                  pathname,
                  query: {
                    ...Object.fromEntries(searchParams.entries()),
                    page: params.page + 1,
                  },
                }}
                className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </Link>
            ) : null}
          </nav>
        </div>
      </div>
    </div>
  );
}
