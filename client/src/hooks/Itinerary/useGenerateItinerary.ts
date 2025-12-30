import { usePlanStore, type State } from '@/store';
import type { ItineraryItem, Place } from '@/types';
import { convertMinutesToTime, convertTimeToMinutes, formatTimeUnit } from '@/utils/time';
import { useQuery } from '@tanstack/react-query';

// 커스텀 훅
export default function useGenerateItinerary() {
  const plannedPlaces = usePlanStore((s) => s.plannedPlaces);
  const dailyTimes = usePlanStore((s) => s.dailyTimes);
  const isInvalid = plannedPlaces.length === 0 || dailyTimes.length === 0;
  const query = useQuery({
    queryKey: ['itinerary', plannedPlaces, dailyTimes],
    queryFn: () => generateItinerary(plannedPlaces, dailyTimes),
    enabled: !isInvalid,
  });

  return { ...query, isInvalid };
}

// 구글맵 매트릭스 API
function getMatrix(
  locations: { lat: number; lng: number }[]
): Promise<google.maps.DistanceMatrixResponse> {
  const distanceMatrix = new google.maps.DistanceMatrixService();

  // 2. 그러므로 Promise로 래핑 작업
  return new Promise((resolve, reject) => {
    const request: google.maps.DistanceMatrixRequest = {
      origins: locations,
      destinations: locations,
      travelMode: google.maps.TravelMode.TRANSIT,
    };

    // 1. getDistanceMatrix는 콜백 기반 API
    distanceMatrix.getDistanceMatrix(request, (res, status) => {
      if (status === google.maps.DistanceMatrixStatus.OK) {
        resolve(res!);
      } else {
        reject(status);
      }
    });
  });
}

// 일정 생성
async function generateItinerary(places: State['plannedPlaces'], dailyTimes: State['dailyTimes']) {
  const locations = places.map(({ place }) => place.coordinates);

  try {
    const matrix = await getMatrix(locations);
    const route = findOptimalRoute(matrix);
    const itinerary = groupPlacesByDay({ route, places, matrix }, dailyTimes);

    return itinerary;
  } catch (error) {
    console.error('getMatrix 비동기 함수 실패:', error);
    throw error;
  }
}

// 최적 경로 찾기
function findOptimalRoute(matrix: google.maps.DistanceMatrixResponse) {
  const startPoints = matrix.rows;
  const visitedPoints = new Set<number>();
  const route = [0];
  visitedPoints.add(0);

  while (visitedPoints.size < startPoints.length) {
    const currentIndex = route[route.length - 1];

    // 조건부를 사용하기 위한 기준이 필요하고 그 값은 정반대 값을 대입
    let minDistance = Infinity;
    let nextPoint = -1;

    for (let i = 0; i < startPoints.length; i++) {
      if (visitedPoints.has(i)) {
        continue;
      }

      const distance = matrix.rows[currentIndex].elements[i].distance.value;
      if (distance < minDistance) {
        minDistance = distance;
        nextPoint = i;
      }
    }

    if (nextPoint !== -1) {
      visitedPoints.add(nextPoint);
      route.push(nextPoint);
    }
  }

  return route;
}

// 일일 장소 그룹화
const THRESHOLD = 10_000;
function groupPlacesByDay(
  {
    route,
    places,
    matrix,
  }: {
    route: number[];
    places: State['plannedPlaces'];
    matrix: google.maps.DistanceMatrixResponse;
  },
  dailyTimes: State['dailyTimes']
) {
  const itinerary: ItineraryItem[][] = [];
  const times = dailyTimes.map(
    ({ startTime, endTime }) => convertTimeToMinutes(endTime) - convertTimeToMinutes(startTime)
  );
  let dailyDuration = 0;

  route.forEach((placeIndex, i) => {
    const place = places[placeIndex];
    const stayDuration = place.duration; // 현재 장소 체류시간

    if (itinerary.length === 0) {
      const firstDayIndex = itinerary.length;
      const startMinutes = convertTimeToMinutes(dailyTimes[firstDayIndex].startTime);

      itinerary.push([createDayItem(place, startMinutes)]);
      dailyDuration = stayDuration;

      return;
    }

    const day = itinerary[itinerary.length - 1];
    const prevPlaceIndex = route[i - 1];

    const element = matrix.rows[prevPlaceIndex].elements[placeIndex];
    const distance = element.distance.value; // 이전 장소 -> 현재 장소 거리
    const moveDuration = Math.ceil(element.duration.value / 60); // 이전 장소 -> 현재 장소 이동시간

    const totalDuration = dailyDuration + moveDuration + stayDuration; // 기존 누적 시간 + 이동 시간 + 체류 시간

    if (distance > THRESHOLD || totalDuration > times[itinerary.length - 1]) {
      // 초기화(새로운 날)
      const newDayIndex = itinerary.length;
      const startMinutes = convertTimeToMinutes(dailyTimes[newDayIndex].startTime);

      itinerary.push([createDayItem(place, startMinutes)]);
      dailyDuration = stayDuration;
    } else {
      // 추가(같은 날)
      const currentDayIndex = itinerary.length - 1;
      const startMinutes =
        convertTimeToMinutes(dailyTimes[currentDayIndex].startTime) + dailyDuration + moveDuration;

      day.push(createDayItem(place, startMinutes));
      dailyDuration = totalDuration;
    }
  });

  while (itinerary.length < times.length) {
    const maxIndex = itinerary.reduce((acc, day, index) => {
      if (day.length > itinerary[acc].length) {
        return index;
      }
      return acc;
    }, 0);

    if (itinerary[maxIndex].length === 1) break;

    const day = itinerary[maxIndex];
    const half = Math.floor(day.length / 2);

    itinerary[maxIndex] = day.slice(0, half);
    itinerary.push(day.slice(half));
  }

  return itinerary;
}

// 유틸 함수
function createDayItem(
  place: { place: Place; duration: number },
  startMinutes: number
): ItineraryItem {
  const endMinutes = startMinutes + place.duration;
  const { hours: sh, minutes: sm } = convertMinutesToTime(startMinutes);
  const { hours: eh, minutes: em } = convertMinutesToTime(endMinutes);

  return {
    ...place,
    startTime: `${formatTimeUnit(sh)}:${formatTimeUnit(sm)}`,
    endTime: `${formatTimeUnit(eh)}:${formatTimeUnit(em)}`,
  };
}
