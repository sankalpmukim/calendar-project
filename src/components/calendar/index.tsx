import CalendarLayout from "~/components/calendar/Layout";
import EventItem from "~/components/calendar/EventItem";
import { endOfWeek, format, startOfToday, startOfWeek } from "date-fns";
import { useState } from "react";
import { api } from "~/utils/api";
import { useCalendarContext } from "./useCalendars";

export default function Calendar() {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);

  const [currentMonth, setCurrentMonth] = useState(
    format(selectedDay, "LLLL yyyy")
  );
  const firstDayCurrentWeek = startOfWeek(selectedDay);

  const previousWeek = () => {
    const previousWeek = new Date(
      firstDayCurrentWeek.setDate(firstDayCurrentWeek.getDate() - 7)
    );
    setSelectedDay(previousWeek);

    // month
    setCurrentMonth(format(previousWeek, "LLLL yyyy"));
  };

  const nextWeek = () => {
    const nextWeek = new Date(
      firstDayCurrentWeek.setDate(firstDayCurrentWeek.getDate() + 7)
    );
    setSelectedDay(nextWeek);

    // month
    setCurrentMonth(format(nextWeek, "LLLL yyyy"));
  };

  const todayWeek = () => {
    setSelectedDay(today);

    // month
    setCurrentMonth(format(today, "LLLL yyyy"));
  };

  const { data, isLoading, isError, error, refetch } =
    api.event.getAllInARange.useQuery({
      start: startOfWeek(selectedDay, {
        weekStartsOn: 1,
      }).toISOString(),
      end: endOfWeek(selectedDay, {
        weekStartsOn: 1,
      }).toISOString(),
    });

  const [calendarIds] = useCalendarContext();

  return (
    <CalendarLayout
      currentMonth={currentMonth}
      previousWeek={previousWeek}
      nextWeek={nextWeek}
      todayWeek={todayWeek}
      selectedDay={selectedDay}
      today={today}
      loading={isLoading}
      error={isError}
      refetch={refetch}
    >
      {error && <p>{error.message}</p>}
      <ol
        className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
        style={{
          gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto",
        }}
      >
        {data &&
          data
            .filter((v) => calendarIds.includes(v.calendarId))
            .map((event) => (
              <EventItem
                key={event.id}
                startTime={new Date(event.start)}
                endTime={new Date(event.end)}
                title={event.name}
                color={event.calendar.color}
              />
            ))}
      </ol>
    </CalendarLayout>
  );
}
