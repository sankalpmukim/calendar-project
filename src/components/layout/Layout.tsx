/* eslint-disable @next/next/no-img-element */
import { Fragment, ReactNode, SVGProps, useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";
import { classNames } from "~/utils/css";
import { logOut } from "~/services/auth";
import useSession from "~/components/session/useSession";
import Link from "next/link";
import { api } from "~/utils/api";
import { Calendar } from "@prisma/client";
import { useCalendarContext } from "~/components/calendar/useCalendars";
import MarketingScreen from "~/components/MarketingScreen";
import { CalendarColors } from "~/components/calendar/EventItem";
import { useAddCalendarModalContext } from "../calendar/AddCalendar";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.FC<Omit<SVGProps<SVGSVGElement>, "ref">>;
  current: boolean;
}

const navigation: NavigationItem[] = [
  { name: "Calendar", href: "/", icon: CalendarIcon, current: true },
];

// interface CalendarLocal {
//   id: string;
//   name: string;
//   onClick: () => void;
//   selected: boolean;
// }
type CalendarLocal = Calendar & {
  onClick: () => void;
  selected: boolean;
};

type UserNavigationType = {
  name: string;
} & (
  | {
      href: string;
      onClick?: never;
    }
  | {
      onClick: () => void;
      href?: never;
    }
);
const userNavigation: UserNavigationType[] = [
  { name: "Your profile", href: "#" },
  {
    name: "Sign out",
    onClick() {
      console.log("sign out");
      logOut();
    },
  },
];

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props): JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const session = useSession();
  const setOpen = useAddCalendarModalContext()[1];

  return (
    <>
      {session ? (
        <div>
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-50 lg:hidden"
              onClose={setSidebarOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-900/80" />
              </Transition.Child>

              <div className="fixed inset-0 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                        <button
                          type="button"
                          className="-m-2.5 p-2.5"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className="sr-only">Close sidebar</span>
                          <XMarkIcon
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </Transition.Child>
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                      <div className="flex h-16 shrink-0 items-center">
                        <img
                          className="h-8 w-auto"
                          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                          alt="Your Company"
                        />
                      </div>
                      <nav className="flex flex-1 flex-col">
                        <ul
                          role="list"
                          className="flex flex-1 flex-col gap-y-7"
                        >
                          <li>
                            <ul role="list" className="-mx-2 space-y-1">
                              {navigation.map((item) => (
                                <li key={item.name}>
                                  <Link
                                    href={item.href}
                                    className={classNames(
                                      item.current
                                        ? "bg-gray-50 text-indigo-600"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                    )}
                                  >
                                    <item.icon
                                      className={classNames(
                                        item.current
                                          ? "text-indigo-600"
                                          : "text-gray-400 group-hover:text-indigo-600",
                                        "h-6 w-6 shrink-0"
                                      )}
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                          <li>
                            <div className="text-xs font-semibold leading-6 text-gray-400">
                              Your calendars
                            </div>
                            <ul role="list" className="-mx-2 mt-2 space-y-1">
                              <CalendarList />
                              <li>
                                <button
                                  className={classNames(
                                    "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                    "group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                  )}
                                  onClick={() => setOpen(true)}
                                >
                                  <span
                                    className={classNames(
                                      "border-gray-200 text-indigo-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
                                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium"
                                    )}
                                  >
                                    <PlusCircleIcon className="h-4 w-4" />
                                  </span>
                                  <span className="truncate">{`Create New Calendar`}</span>
                                </button>
                              </li>
                            </ul>
                          </li>
                          <li className="mt-auto">
                            <a
                              href="#"
                              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                            >
                              <Cog6ToothIcon
                                className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                                aria-hidden="true"
                              />
                              Settings
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>

          {/* Static sidebar for desktop */}
          <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
              <div className="flex h-16 shrink-0 items-center">
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt="Calendar"
                />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      <NavigationList navigation={navigation} />
                    </ul>
                  </li>
                  <li>
                    <div className="text-xs font-semibold leading-6 text-gray-400">
                      Your calendars
                    </div>
                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                      <CalendarList />
                      <li>
                        <button
                          className={classNames(
                            "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                            "group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                          )}
                          onClick={() => setOpen(true)}
                        >
                          <span
                            className={classNames(
                              "border-gray-200 text-indigo-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium"
                            )}
                          >
                            <PlusCircleIcon className="h-4 w-4" />
                          </span>
                          <span className="truncate">{`Create New Calendar`}</span>
                        </button>
                      </li>
                    </ul>
                  </li>
                  <li className="mt-auto">
                    <a
                      href="#"
                      className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    >
                      <Cog6ToothIcon
                        className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                        aria-hidden="true"
                      />
                      Settings
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <div className="lg:pl-72">
            <div className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Separator */}
              <div
                className="h-6 w-px bg-gray-200 lg:hidden"
                aria-hidden="true"
              />

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <form className="relative flex flex-1" action="#" method="GET">
                  <label htmlFor="search-field" className="sr-only">
                    Search
                  </label>
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <input
                    id="search-field"
                    className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                    placeholder="Search..."
                    type="search"
                    name="search"
                  />
                </form>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Separator */}
                  <div
                    className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                    aria-hidden="true"
                  />

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="-m-1.5 flex items-center p-1.5">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full bg-gray-50"
                        src={`https://${
                          process.env.NEXT_PUBLIC_S3_BUCKET ?? ``
                        }.s3.amazonaws.com/${session.id}.png`}
                        alt=""
                      />
                      <span className="hidden lg:flex lg:items-center">
                        <span
                          className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                          aria-hidden="true"
                        >
                          @{session.username}
                        </span>
                        <ChevronDownIcon
                          className="ml-2 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => {
                              if (typeof item.href !== "undefined") {
                                return (
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? "bg-gray-50" : "",
                                      "block px-3 py-1 text-sm leading-6 text-gray-900"
                                    )}
                                  >
                                    {item.name}
                                  </a>
                                );
                              } else {
                                return (
                                  <button
                                    type="button"
                                    className={classNames(
                                      active ? "bg-gray-50" : "",
                                      "block w-full px-3 py-1 text-left text-sm leading-6 text-gray-900"
                                    )}
                                    onClick={item.onClick}
                                  >
                                    {item.name}
                                  </button>
                                );
                              }
                            }}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            <main className="py-10">
              <div className="px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>
        </div>
      ) : (
        <>
          <MarketingScreen />
        </>
      )}
    </>
  );
}

function NavigationList({ navigation }: { navigation: NavigationItem[] }) {
  const { data, isLoading, isError, error } = api.calendar.getAll.useQuery();
  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div>
        <div>Error</div>
        <div>{error.message}</div>
      </div>
    );
  if (!data) return <div>Not logged in</div>;
  return (
    <>
      {navigation.map((item) => (
        <li key={item.name}>
          <a
            href={item.href}
            className={classNames(
              item.current
                ? "bg-gray-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
            )}
          >
            <item.icon
              className={classNames(
                item.current
                  ? "text-indigo-600"
                  : "text-gray-400 group-hover:text-indigo-600",
                "h-6 w-6 shrink-0"
              )}
              aria-hidden="true"
            />
            {item.name}
          </a>
        </li>
      ))}
    </>
  );
}

function CalendarList() {
  const {
    data: calendars,
    isLoading,
    isError,
    error,
  } = api.calendar.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div>
        <div>Error</div>
        <div>{error.message}</div>
      </div>
    );
  if (!calendars) return <div>Not logged in</div>;
  return (
    <>
      <CalendarListWithData calendarsApi={calendars} />
    </>
  );
}

function CalendarListWithData({ calendarsApi }: { calendarsApi: Calendar[] }) {
  const [calendars, setCalendars] = useState<CalendarLocal[]>(
    calendarsApi.map((v, i) => ({
      ...v,
      selected: true,
      onClick: () => {
        setCalendars((prev) =>
          prev.map((v, j) => ({
            ...v,
            selected: i === j ? !v.selected : v.selected,
          }))
        );
      },
    }))
  );

  const setCalendarIds = useCalendarContext()[1];

  useEffect(() => {
    setCalendarIds(calendars.filter((v) => v.selected).map((v) => v.id));
  }, [calendars, setCalendarIds]);
  return (
    <>
      {calendars.map((calendar) => (
        <li key={calendar.id}>
          <button
            onClick={calendar.onClick}
            className={classNames(
              calendar.selected
                ? buttonSelectedClass(calendar.color)
                : buttonUnselectedClass(calendar.color),
              "group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
            )}
          >
            <span
              className={classNames(
                calendar.selected
                  ? buttonSpanSelectedClass(calendar.color)
                  : buttonSpanUnselectedClass(calendar.color),
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium"
              )}
            >
              {calendar.name[0]?.toUpperCase()}
            </span>
            <span className="truncate">{calendar.name}</span>
          </button>
        </li>
      ))}
    </>
  );
}

function buttonSelectedClass(color: CalendarColors) {
  switch (color) {
    case "RED":
      return "bg-gray-50 text-red-600";
    case "ORANGE":
      return "bg-gray-50 text-orange-600";
    case "YELLOW":
      return "bg-gray-50 text-yellow-600";
    case "GREEN":
      return "bg-gray-50 text-green-600";
    case "BLUE":
      return "bg-gray-50 text-blue-600";
    case "PURPLE":
      return "bg-gray-50 text-purple-600";
    case "PINK":
      return "bg-gray-50 text-pink-600";
    default:
      return "bg-gray-50 text-indigo-600";
  }
}

function buttonUnselectedClass(color: CalendarColors) {
  switch (color) {
    case "RED":
      return "text-gray-700 hover:bg-gray-50 hover:text-red-600";
    case "ORANGE":
      return "text-gray-700 hover:bg-gray-50 hover:text-orange-600";
    case "YELLOW":
      return "text-gray-700 hover:bg-gray-50 hover:text-yellow-600";
    case "GREEN":
      return "text-gray-700 hover:bg-gray-50 hover:text-green-600";
    case "BLUE":
      return "text-gray-700 hover:bg-gray-50 hover:text-blue-600";
    case "PURPLE":
      return "text-gray-700 hover:bg-gray-50 hover:text-purple-600";
    case "PINK":
      return "text-gray-700 hover:bg-gray-50 hover:text-pink-600";
    default:
      return "text-gray-700 hover:bg-gray-50 hover:text-indigo-600";
  }
}

function buttonSpanSelectedClass(color: CalendarColors) {
  switch (color) {
    case "RED":
      return "border-red-600 text-red-600";
    case "ORANGE":
      return "border-orange-600 text-orange-600";
    case "YELLOW":
      return "border-yellow-600 text-yellow-600";
    case "GREEN":
      return "border-green-600 text-green-600";
    case "BLUE":
      return "border-blue-600 text-blue-600";
    case "PURPLE":
      return "border-purple-600 text-purple-600";
    case "PINK":
      return "border-pink-600 text-pink-600";
    default:
      return "border-indigo-600 text-indigo-600";
  }
}

function buttonSpanUnselectedClass(color: CalendarColors) {
  switch (color) {
    case "RED":
      return "border-gray-200 text-red-400 group-hover:border-red-600 group-hover:text-red-600";
    case "ORANGE":
      return "border-gray-200 text-orange-400 group-hover:border-orange-600 group-hover:text-orange-600";
    case "YELLOW":
      return "border-gray-200 text-yellow-400 group-hover:border-yellow-600 group-hover:text-yellow-600";
    case "GREEN":
      return "border-gray-200 text-green-400 group-hover:border-green-600 group-hover:text-green-600";
    case "BLUE":
      return "border-gray-200 text-blue-400 group-hover:border-blue-600 group-hover:text-blue-600";
    case "PURPLE":
      return "border-gray-200 text-purple-400 group-hover:border-purple-600 group-hover:text-purple-600";
    case "PINK":
      return "border-gray-200 text-pink-400 group-hover:border-pink-600 group-hover:text-pink-600";
    default:
      return "border-gray-200 text-indigo-400 group-hover:border-indigo-600 group-hover:text-indigo-600";
  }
}
