export interface City {
  _id?: string;
  code: string; // 도시 코드, 구분자 역할 (ex: seoul, busan, tokyo)
  name: string; // 도시 한글 이름 (ex: 서울, 부산, 도쿄)
  nameEn: string; // 도시 영어 이름 (ex: Seoul, Busan, Tokyo)
  description: string; // 도시 설명 (ex: 대한민국의 수도)
  thumbnail: string; // 도시 썸네일 이미지 URL (ex: https://example.com/seoul.jpg)
  timezone: string; // 도시 시간대 (ex: Asia/Seoul, Asia/Tokyo)
  flightHours: number; // 한국에서 해당 도시까지의 비행 시간 (ex: 2, 3.5)
  timezoneOffset: number; // UTC 기준 시간 오프셋 (ex: 9, 10)
  coordinates: { lat: number; lng: number }; // 도시 좌표 (위도, 경도)
  country: Country; // 도시가 속한 국가 코드 (ex: KR, JP)
}

export interface Country {
  _id?: string;
  code: string; // 국가 코드, 구분자 역할 (ex: KR, JP)
  name: string; // 국가 한글 이름 (ex: 대한민국, 일본)
  nameEn: string; // 국가 영어 이름 (ex: South Korea, Japan)
  voltage: number; // 국가 전압 (ex: 220, 110)
  visa: {
    required: boolean; // 비자 필요 여부
    duration: number; // 비자 체류 가능 기간 (일수)
  };
  continent:
    | "Asia"
    | "Europe"
    | "North America"
    | "South America"
    | "Africa"
    | "Oceania"; // 대륙
}
