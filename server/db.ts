import DataStore from "nedb";

// DB 설정
export const citiesDB = new DataStore({
  filename: "data/cities.db",
  autoload: true,
});

export const countriesDB = new DataStore({
  filename: "data/countries.db",
  autoload: true,
});

export const placesDB = new DataStore({
  filename: "data/places.db",
  autoload: true,
});
// DB 인덱스 맵 생성 -> 검색 속도 증가
placesDB.ensureIndex({ fieldName: "cityCode" });
