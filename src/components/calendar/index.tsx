import CalendarLayout from "~/components/calendar/Layout";
import EventItem from "~/components/calendar/EventItem";

export default function Calendar() {
  return (
    <CalendarLayout>
      <ol
        className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
        style={{
          gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto",
        }}
      >
        <li
          className="relative mt-px flex sm:col-start-3"
          style={{ gridRow: "74 / span 12" }}
        >
          <a
            href="#"
            className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100"
          >
            <p className="order-1 font-semibold text-blue-700">Breakfast</p>
            <p className="text-blue-500 group-hover:text-blue-700">
              <time dateTime="2022-01-12T06:00">6:00 AM</time>
            </p>
          </a>
        </li>
        <EventItem
          startTime={new Date("2023-04-16T02:30:00.00")}
          endTime={new Date("2023-04-16T03:30:00.00")}
          title={"My important Meeting"}
        />
      </ol>
    </CalendarLayout>
  );
}
