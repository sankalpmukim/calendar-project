import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
export type CalendarContextType = [
  calendarIds: string[],
  setCalendarIds: Dispatch<SetStateAction<string[]>>
];

export const CalendarContext = createContext<CalendarContextType>([
  [],
  () => ({}),
]);

export const useCalendarContext = () => useContext(CalendarContext);

export const CalendarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [calendarIds, setCalendarIds] = useState<string[]>([]);
  return (
    <CalendarContext.Provider value={[calendarIds, setCalendarIds]}>
      {children}
    </CalendarContext.Provider>
  );
};
