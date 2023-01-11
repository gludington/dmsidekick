"use client";
import { Fragment, useMemo } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const navigation = [
  { name: "Home", href: "/", current: true },
  //{ name: "Monsters", href: "/monsters", current: false },
  { name: "Monster Helper", href: "/monsters/helper", current: false },
  //{ name: "Projects", href: "#", current: false },
  //{ name: "Calendar", href: "#", current: false },
  { name: "About", href: "/about", current: false },
];
const userNavigation = [
  //{ name: "Your Profile", href: "#" },
  //{ name: "My Monsters", href: "/profile/monsters" },
  { name: "Sign out", href: "#", onClick: () => signOut() },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const session = useSession();
  const path = usePathname();
  const nav = useMemo(() => {
    return navigation.map((item) => {
      return { ...item, current: path == item.href };
    });
  }, [path]);

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Image
                        className="h-8 w-8"
                        width="40"
                        height="40"
                        src="/dmsidekick.png"
                        alt="DM Sidekick"
                      />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {nav.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            shallow={true}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      {/*<button
                        type="button"
                        className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                        
                      {/* Profile dropdown */}
                      {!session ||
                      session.status === "loading" ? null : session.status ===
                        "authenticated" ? (
                        <Menu as="div" className="relative ml-3">
                          <div>
                            <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                              <span className="sr-only">Open user menu</span>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                className="h-8 w-8 rounded-full"
                                src={session.data?.user?.image || ""}
                                alt={session.data?.user?.name || ""}
                              />
                            </Menu.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {userNavigation.map((item) => (
                                <Menu.Item key={item.name}>
                                  {({ active }) => (
                                    <Link
                                      href={item.href}
                                      shallow={true}
                                      onClick={item.onClick}
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                    >
                                      {item.name}
                                    </Link>
                                  )}
                                </Menu.Item>
                              ))}
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      ) : (
                        <>
                          <span className="sr-only">Open user menu</span>
                          <button
                            type="button"
                            className="dark:focus:ring-[#3b5998]/55 mr-2 mb-2 inline-flex items-center rounded-full bg-[#5865F2] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#3b5998]/90 focus:outline-none focus:ring-4 focus:ring-[#3b5998]/50"
                            onClick={() => signIn()}
                          >
                            Sign In
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                  {nav.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-gray-700 pt-4 pb-3">
                  {!session ||
                  session.status === "loading" ? null : session.status ===
                    "authenticated" ? (
                    <div className="mt-3 space-y-1 px-2">
                      {userNavigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                        >
                          <Link
                            shallow={true}
                            href={item.href}
                            onClick={item.onClick}
                          >
                            {item.name}
                          </Link>
                        </Disclosure.Button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center px-5">
                      <div className="flex-shrink-0">
                        <button
                          className={classNames(
                            false
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "block rounded-md px-3 py-2 text-base font-medium"
                          )}
                          onClick={() => signIn()}
                        >
                          Sign In
                        </button>
                      </div>
                      <button
                        type="button"
                        className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
}
