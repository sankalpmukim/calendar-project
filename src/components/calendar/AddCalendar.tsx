/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Fragment,
  useState,
  createContext,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import TextInput from "~/components/inputs/TextInput";
import { api } from "~/utils/api";
import useNotify from "~/components/notifications/useNotify";
import SelectInput from "~/components/inputs/SelectInput";
import { COLORS } from "./contants";
import { COLOR_CIRCLES } from "./contants";
import { CalendarColors } from "./EventItem";

interface ColorOption {
  id: string;
  name: string;
  avatar: ReactNode;
}

export default function AddCalendar() {
  const [open, setOpen] = useAddCalendarModalContext();
  const [title, setTitle] = useState<string>("");
  const [color, setColor] = useState<{
    id: string;
    name: string;
    avatar: ReactNode;
  }>({
    id: "RED",
    name: "RED",
    avatar: COLOR_CIRCLES.RED,
  });

  // const createEventMutation = api.event.createEvent.useMutation();
  const notify = useNotify();
  const createCalendarMutation = api.calendar.createCalendar.useMutation();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <PlusIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {`Create a Calendar`}
                    </Dialog.Title>
                    <div className="mt-2">
                      <TextInput
                        id={"name"}
                        label={"Name the calendar"}
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                      />
                    </div>
                    <div className="mt-2">
                      <SelectInput
                        options={COLORS.map((color) => ({
                          id: color,
                          name: color,
                          avatar: COLOR_CIRCLES[color],
                        }))}
                        setSelected={function (option: ColorOption): void {
                          setColor(option);
                        }}
                        label={"Choose Color"}
                        selected={color}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={async () => {
                      try {
                        await createCalendarMutation.mutateAsync({
                          name: title,
                          color: color.id as CalendarColors,
                        });
                        notify({
                          title: "Calendar Created",
                          message: "Calendar created successfully",
                          type: "success",
                          show: true,
                        });
                        setOpen(false);
                        // clear form
                        setTitle("");
                        setColor({
                          id: "RED",
                          name: "RED",
                          avatar: COLOR_CIRCLES.RED,
                        });
                      } catch (error) {
                        notify({
                          title: "Error",
                          message: "Error creating calendar",
                          type: "error",
                          show: true,
                        });
                      }
                    }}
                  >
                    {`Create Event`}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

type AddCalendarModalContextType = [boolean, Dispatch<SetStateAction<boolean>>];
export const AddCalendarModalContext =
  createContext<AddCalendarModalContextType>([false, () => ({})]);

export const useAddCalendarModalContext = () =>
  useContext(AddCalendarModalContext);

export const AddCalendarModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <AddCalendarModalContext.Provider value={[open, setOpen]}>
      {children}
    </AddCalendarModalContext.Provider>
  );
};
