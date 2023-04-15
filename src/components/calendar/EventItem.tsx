import { format } from "date-fns";
import { classNames } from "~/utils/css";

interface Props {
  startTime: Date;
  endTime: Date;
  title: string;
}

export default function EventItem({ startTime, endTime, title }: Props) {
  return (
    <li
      className={classNames(
        "relative mt-px hidden sm:flex",
        calculateColumnStart(startTime)
      )}
      style={{ gridRow: calculateGridRowStyle(startTime, endTime) }}
    >
      <a
        href="#"
        className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-gray-100 p-2 text-xs leading-5 hover:bg-gray-200"
      >
        <p className="order-1 font-semibold text-gray-700">{title}</p>
        <p className="text-gray-500 group-hover:text-gray-700">
          <time dateTime="2022-01-15T10:00">{format(startTime, "h:m a")}</time>
        </p>
      </a>
    </li>
  );
}

function calculateGridRowStyle(startTime: Date, endTime: Date) {
  const minutesPerRow = 5;

  // Convert start time and end time to minutes since midnight
  const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
  const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();

  // Calculate duration in minutes
  const durationMinutes = endMinutes - startMinutes;

  // Calculate starting row and span
  const startRow = Math.floor(startMinutes / minutesPerRow) + 2;
  const span = Math.ceil(durationMinutes / minutesPerRow);

  // Return the gridRow style value
  return `${startRow} / span ${span}`;
}

function calculateColumnStart(eventDate: Date) {
  const dayOfWeek = eventDate.getDay();
  switch (dayOfWeek) {
    case 0:
      return `sm:col-start-7`;
    case 1:
      return `sm:col-start-1`;
    case 2:
      return `sm:col-start-2`;
    case 3:
      return `sm:col-start-3`;
    case 4:
      return `sm:col-start-4`;
    case 5:
      return `sm:col-start-5`;
    case 6:
      return `sm:col-start-6`;
    default:
      throw new Error("Could not get col-start-value");
  }
}
