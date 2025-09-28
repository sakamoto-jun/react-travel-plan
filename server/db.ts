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
