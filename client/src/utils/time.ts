import type { Place } from "@/types";

// Minutes(분)을 시간 형태(객체)로 변환 ex) 120 -> { hours: 2, minutes: 0 }
export function convertMinutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
}

// 시간 형태(00:00)을 Minutes(분)로 변환 ex) "01:20" -> 80
export function convertTimeToMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);

  return hour * 60 + minute;
}

// 값을 두자리 형태로 변환 ex) "1:20" -> "01:20"
export function formatTimeUnit(value: number) {
  return String(value).padStart(2, "0");
}

// 값(value)을 최소(min)과 최대(max) 사이로 제한
export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

// 계획한 장소의 총 체류 시간(plannedTotal)과 전체 여행 가능 시간(totalAvailable) 비교
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
