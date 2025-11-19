import type { Place } from "@/types";

export function convertMinutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
}

export function convertTimeToMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);

  return hour * 60 + minute;
}

export function formatTimeUnit(value: number) {
  return String(value).padStart(2, "0");
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function exceedsTotalAvailableTime(
  plannedPlaces: {
    place: Place;
    duration: number;
  }[],
  dailyTimes: { startTime: string; endTime: string; date: Date }[]
): boolean {
  const plannedTotal = plannedPlaces.reduce(
    (sum, { duration }) => sum + duration,
    0
  );
  const totalAvailable = dailyTimes.reduce((sum, { startTime, endTime }) => {
    return (
      sum + (convertTimeToMinutes(endTime) - convertTimeToMinutes(startTime))
    );
  }, 0);

  return plannedTotal > totalAvailable;
}
