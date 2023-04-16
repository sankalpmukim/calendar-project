import { format } from "date-fns";
import { classNames } from "~/utils/css";

export type CalendarColors =
  | "RED"
  | "ORANGE"
  | "YELLOW"
  | "GREEN"
  | "BLUE"
  | "PURPLE"
  | "PINK";

interface Props {
  startTime: Date;
  endTime: Date;
  title: string;
  color: CalendarColors;
}

export default function EventItem({ startTime, endTime, title, color }: Props) {
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
        className={classNames(
          "group absolute inset-1 flex flex-col overflow-y-auto rounded-lg  p-2 text-xs leading-5",
          linkClasses(color)
        )}
      >
        <p className={classNames("order-1 font-semibold", titleClasses(color))}>
          {title}
        </p>
        <p className={classNames(timeClasses(color))}>
          <time dateTime="2022-01-15T10:00">{format(startTime, "h:mm a")}</time>
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

function linkClasses(color: CalendarColors) {
  switch (color) {
    case "RED":
      return "bg-red-50 hover:bg-red-100";
    case "ORANGE":
      return "bg-orange-50 hover:bg-orange-100";
    case "YELLOW":
      return "bg-yellow-50 hover:bg-yellow-100";
    case "GREEN":
      return "bg-green-50 hover:bg-green-100";
    case "BLUE":
      return "bg-blue-50 hover:bg-blue-100";
    case "PURPLE":
      return "bg-purple-50 hover:bg-purple-100";
    case "PINK":
      return "bg-pink-50 hover:bg-pink-100";
    default:
      throw new Error("Could not get link color");
  }
}

function titleClasses(color: CalendarColors) {
  switch (color) {
    case "RED":
      return "text-red-700";
    case "ORANGE":
      return "text-orange-700";
    case "YELLOW":
      return "text-yellow-700";
    case "GREEN":
      return "text-green-700";
    case "BLUE":
      return "text-blue-700";
    case "PURPLE":
      return "text-purple-700";
    case "PINK":
      return "text-pink-700";
    default:
      throw new Error("Could not get title color");
  }
}

function timeClasses(color: CalendarColors) {
  switch (color) {
    case "RED":
      return "text-red-500 group-hover:text-red-700";
    case "ORANGE":
      return "text-orange-500 group-hover:text-orange-700";
    case "YELLOW":
      return "text-yellow-500 group-hover:text-yellow-700";
    case "GREEN":
      return "text-green-500 group-hover:text-green-700";
    case "BLUE":
      return "text-blue-500 group-hover:text-blue-700";
    case "PURPLE":
      return "text-purple-500 group-hover:text-purple-700";
    case "PINK":
      return "text-pink-500 group-hover:text-pink-700";
    default:
      throw new Error("Could not get time color");
  }
}
