export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const COLORS = [
  "RED",
  "ORANGE",
  "YELLOW",
  "GREEN",
  "BLUE",
  "PURPLE",
  "PINK",
] as const;

export const COLOR_CIRCLES = {
  RED: (
    <div className="ml-5 flex items-center">
      <div className="h-5 w-5 rounded-full bg-red-500" />
    </div>
  ),
  ORANGE: (
    <div className="ml-5 flex items-center">
      <div className="h-5 w-5 rounded-full bg-orange-500" />
    </div>
  ),
  YELLOW: (
    <div className="ml-5 flex items-center">
      <div className="h-5 w-5 rounded-full bg-yellow-500" />
    </div>
  ),
  GREEN: (
    <div className="ml-5 flex items-center">
      <div className="h-5 w-5 rounded-full bg-green-500" />
    </div>
  ),
  BLUE: (
    <div className="ml-5 flex items-center">
      <div className="h-5 w-5 rounded-full bg-blue-500" />
    </div>
  ),
  PURPLE: (
    <div className="ml-5 flex items-center">
      <div className="h-5 w-5 rounded-full bg-purple-500" />
    </div>
  ),
  PINK: (
    <div className="ml-5 flex items-center">
      <div className="h-5 w-5 rounded-full bg-pink-500" />
    </div>
  ),
} as const;
