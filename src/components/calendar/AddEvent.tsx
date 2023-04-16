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
import TextInput from "../inputs/TextInput";
import { api } from "~/utils/api";
import SelectInput from "../inputs/SelectInput";
import { useCalendarContext } from "./useCalendars";
import useNotify from "../notifications/useNotify";

interface CalendarOpiton {
  id: string;
  name: string;
  online: boolean;
}

export default function AddEvent() {
  const [open, setOpen] = useAddEventModalContext();
  const [title, setTitle] = useState<string>("");
  const [calendar, setCalendar] = useState<CalendarOpiton>();
  const [startTimestamp, setStartTimestamp] = useState<string>("");
  const [endTimestamp, setEndTimestamp] = useState<string>("");

  const { data } = api.calendar.getAll.useQuery();
  const [calendarIds] = useCalendarContext();
  const createEventMutation = api.event.createEvent.useMutation();
  const notify = useNotify();

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
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
                      {`Create Event`}
                    </Dialog.Title>
                    <div className="mt-2">
                      <TextInput
                        id={"title"}
                        label={"Title of event"}
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                      />
                    </div>
                    {typeof data !== "undefined" ? (
                      <div className="mt-2">
                        <SelectInput
                          options={data.map((calendar) => ({
                            name: calendar.name,
                            id: calendar.id,
                            online: calendarIds.includes(calendar.id),
                          }))}
                          selected={calendar}
                          setSelected={setCalendar}
                          label={"Select calendar"}
                        />
                      </div>
                    ) : (
                      <div className="mt-2">
                        <SelectInput
                          options={[]}
                          selected={{
                            name: "Loading...",
                            id: "loading",
                            online: false,
                          }}
                          setSelected={setCalendar}
                          label={"Select calendar"}
                        />
                      </div>
                    )}
                    <div className="mt-2">
                      <label
                        htmlFor="start-time"
                        className="flex items-center justify-between"
                      >
                        Start time
                        <input
                          type="datetime-local"
                          name="date"
                          id="start-time"
                          value={startTimestamp}
                          onChange={(e) => setStartTimestamp(e.target.value)}
                        />
                      </label>
                    </div>
                    {/* End time, same day */}
                    <div className="mt-2">
                      <label
                        htmlFor="end-time"
                        className="flex items-center justify-between"
                      >
                        End time
                        <input
                          type="datetime-local"
                          name="date"
                          id="end-time"
                          value={endTimestamp}
                          onChange={(e) => setEndTimestamp(e.target.value)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={async () => {
                      if (
                        typeof calendar !== "undefined" &&
                        title !== "" &&
                        startTimestamp !== "" &&
                        endTimestamp !== ""
                      ) {
                        await createEventMutation.mutateAsync({
                          calendarId: calendar.id,
                          title,
                          start: `${startTimestamp}:00`,
                          end: `${endTimestamp}:00`,
                        });
                        setOpen(false);
                      } else {
                        notify({
                          title: "Error",
                          message: "Please fill out all fields",
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

type AddEventModalContextType = [boolean, Dispatch<SetStateAction<boolean>>];
export const AddEventModalContext = createContext<AddEventModalContextType>([
  false,
  () => ({}),
]);

export const useAddEventModalContext = () => useContext(AddEventModalContext);

export const AddEventModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <AddEventModalContext.Provider value={[open, setOpen]}>
      {children}
    </AddEventModalContext.Provider>
  );
};
